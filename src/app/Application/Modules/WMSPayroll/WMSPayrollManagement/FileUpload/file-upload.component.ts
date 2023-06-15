import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { interval, Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { FileUploadEmployeeStep2Component } from './file-upload-employee-step2.component'
import { FileUploadStep1Component } from './file-upload-step1.component'
import { FileUploadStep2Component } from './file-upload-step2.component'
import { FileUploadStep3Component } from './file-upload-step3.component'
import { FileUploadService } from './file-upload.service'
import { ResponseGenerateChallenge } from '../../../../Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../../Model/requestvalidateType'

@UntilDestroy()
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(FileUploadStep1Component)
  step1FileUpload: FileUploadStep1Component
  @ViewChild(FileUploadStep2Component)
  step2FilePayment: FileUploadStep2Component
  @ViewChild(FileUploadEmployeeStep2Component)
  step2FileEmployee: FileUploadEmployeeStep2Component
  @ViewChild(FileUploadStep3Component)
  step3FileSalary: FileUploadStep1Component
  @ViewChild('reportErrorTable') table: any
  @ViewChild('reportEmployeeModal', { static: true })
  public reportEmployeeModal: ModalDirective

  reportErrorTable: any
  sub: Subscription
  type: string = null
  step: number
  payrollDetails: any
  subscriptions: Subscription[] = []
  PaymentFileUpload = 'salary'
  EmployeeFileUpload = 'employee'
  datos: any = {}

  initSalaryPayment: any
  initEmployee: any

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate
  confirmPaymentResponse: any

  constructor(
    private route: ActivatedRoute,
    private serviceFileUpload: FileUploadService,
    public translate: TranslateService,
    public storage: StorageService,
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
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.subscriptions.push(
      this.route.data.subscribe((data) => {
        if (data && data.type) {
          this.type = data.type
        } else {
          this.type = this.PaymentFileUpload
        }
      }),
    )
  }

  initSalaryUploadFile() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  next() {
    if (this.type === this.PaymentFileUpload) {
      this.nextPaymentStep()
    }
  }

  nextPaymentStep() {
    switch (this.step) {
      case 1:
        this.initSalaryPayment = {}
        this.datos = {}
        this.serviceFileUpload
          .uploadFileSalary(
            this.step1FileUpload.batchName,
            this.step1FileUpload.file,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initSalaryPayment = result
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.requestValidate = new RequestValidate()
              //console.log(this.initSalaryPayment);
              if (this.initSalaryPayment.linesWithError > 0) {
                this.datos = this.initSalaryPayment
                this.reportEmployeeModal.show()
              } else {
                this.initSalaryPayment.payrollBatch.cic = JSON.parse(
                  this.storage.retrieve('currentUser'),
                )['company']['profileNumber']
                this.initSalaryPayment.salaryPaymentDetails.companyName =
                  JSON.parse(this.storage.retrieve('currentUser'))['company'][
                    'companyName'
                  ]
                this.nextStep()
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .confirm(
            this.initSalaryPayment.salaryPaymentDetails,
            this.initSalaryPayment.payrollBatch,
            this.requestValidate,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
            } else {
              this.initSalaryPayment = result
              this.confirmPaymentResponse = result
              this.nextStep()
            }
          })
        break
      case 3:
        this.nextStep()
        break
    }
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
    if (this.step === 2) {
      this.serviceFileUpload.undoOperation(this.initSalaryPayment.fileName)
    }
  }

  onError(error: any) {}

  isDisabled() {
    if (
      this.step1FileUpload != null &&
      this.step1FileUpload.file != null &&
      this.step1FileUpload.needBatchName === true &&
      this.type == this.PaymentFileUpload &&
      this.step1FileUpload.batchName != null &&
      this.step1FileUpload.batchName != ''
    ) {
      return false
    }
    if (this.step == 2) {
      return false
    }
    return true
  }

  onInitStep1(events) {
    this.step1FileUpload = events
  }

  onInitStep2(events) {
    this.step2FilePayment = events
  }

  // onInitEmployeeStep2(events){
  //     this.step2FileEmployee = events;
  // }
}
