import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { PayrollCardsService } from '../payroll-cards.service'
import { UploadFileStep1Component } from './upload-file-step1.component'
import { UploadFileStep2Component } from './upload-file-step2.component'
import { FileUploadService } from './upload-file.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent
  extends DatatableMobileComponent
  implements OnDestroy, OnInit
{
  @ViewChild('reportErrorTable') table: any
  @ViewChild(UploadFileStep1Component)
  step1FilePayRollCard: UploadFileStep1Component
  @ViewChild(UploadFileStep2Component)
  step2FilePayRollCard: UploadFileStep2Component

  @ViewChild('reportModal', { static: true }) public reportModal: ModalDirective

  //@ViewChild('fileInput') inputEl: ElementRef;
  step: number
  errorMessage: any = {}
  uploadErrors: Boolean = false

  reportErrorTable: any
  subscriptions: Subscription[] = []
  generateChallengeAndOTP: ResponseGenerateChallenge

  datos = {}

  initPayment: any
  rol: any

  constructor(
    private service: FileUploadService,
    public translate: TranslateService,
    private serviceshare: PayrollCardsService,
  ) {
    super()
    this.step = 1
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.serviceshare.getInstitution().subscribe((res) => {
        this.rol = res.institutionDTO.layout
        this.rol.toLowerCase()
      }),
    )
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

  firstStep(): void {
    this.initPayment = {}
    this.datos = {}
    this.service
      .uploadFile(
        this.step1FilePayRollCard.file,
        this.step1FilePayRollCard.batchName,
        null,
      )
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
          } else {
            this.nextStep()
          }
        }
      })
  }

  secondStep(): void {
    this.generateChallengeAndOTP =
      this.step2FilePayRollCard.generateChallengeAndOTP
    this.service
      .saveFile(this.initPayment, this.step2FilePayRollCard.requestValidate)
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

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  isDisabled() {
    if (
      this.step1FilePayRollCard != null &&
      this.step1FilePayRollCard.file != null &&
      this.step1FilePayRollCard.batchName != null
    ) {
      return false
    }
    if (this.step == 2) {
      return false
    }
    return true
  }

  onInitStep1(events) {
    this.step1FilePayRollCard = events
  }

  onInitStep2(events) {
    this.step2FilePayRollCard = events
  }
}
