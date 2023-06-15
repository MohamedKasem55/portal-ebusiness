import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from 'app/Application/Model/exception'
import { FileUploadStep1Component } from './upload-file-step1.component'
import { FileUploadStep2Component } from './upload-file-step2.component'
import { UploadFileService } from './upload-file.service'
import { FileUploadStep3Component } from './upload-file-step3.component'

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('reportModal', { static: true })
  public reportModal: ModalDirective
  @ViewChild('reportErrorTable') table: any

  @ViewChild(FileUploadStep1Component)
  step1Component: FileUploadStep1Component
  @ViewChild(FileUploadStep2Component)
  step2Component: FileUploadStep2Component
  @ViewChild(FileUploadStep3Component)
  step3Component: FileUploadStep2Component

  step: number
  errorMessage: any = {}
  uploadErrors = false
  initPayment: any
  generateChallengeAndOTP: any

  batchName: any
  file: File

  datos = {}
  reportErrorTable: any
  minWidthErrorColumn: number
  constructor(
    public service: UploadFileService,
    public translate: TranslateService,
  ) {
    super()
    this.step = 1
    // this.service.getCompanyDetails().subscribe()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  isDisabled() {
    if (
      this.step1Component != null &&
      this.step1Component.file != null &&
      this.step1Component.batchName != null
    ) {
      return false
    }
    if (this.step == 2) {
      return false
    }
    return true
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  next() {
    if (this.step === 0) {
      this.step = 1
    }

    switch (this.step) {
      case 1:
        this.firstStep()
        break
      case 2:
        this.secondStep()
        break
      case 3:
        this.nextStep()
        break
    }
  }

  firstStep() {
    this.service
      .validateUpload(this.step1Component.file, this.step1Component.batchName)
      .subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.initPayment = result
          if (
            this.initPayment.numberLinesWithErrors &&
            this.initPayment.numberLinesWithErrors > 0
          ) {
            this.datos = this.initPayment
            this.reportModal.show()
            if (this.table) {
              this.minWidthErrorColumn = (window.innerWidth / 400) * 80
            }
          } else {
            if (this.initPayment.bulkPaymentsBatchDTO) {
              this.nextStep()
            }
          }
        }
      })
  }

  secondStep() {
    this.generateChallengeAndOTP = this.step2Component.generateChallengeAndOTP
    //If we got a generateChallengeAndOTP we are processing
    if (this.generateChallengeAndOTP) {
      this.processFile()
    } else {
      //If not we are confirm for pending action
      this.service.confirm(this.initPayment).subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.nextStep()
        }
      })
    }
  }

  processFile() {
    this.service
      .Process(this.initPayment, this.step2Component.requestValidate)
      .subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.nextStep()
        }
      })
  }

  nextStep() {
    this.step = ++this.step % 4

    if (this.step === 0) {
      this.step = 1
    }
  }

  onError(error: any) {
    const res = error
    this.errorMessage['code'] = res.errorCode
    this.errorMessage['description'] = res.errorDescription
  }

  onInitStep1(event) {
    this.step1Component = event
  }
  onInitStep3(event) {
    this.step3Component = event
    this.step3Component.generateChallengeAndOTP = this.generateChallengeAndOTP
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.minWidthErrorColumn = (window.innerWidth / 400) * 80
  }
}
