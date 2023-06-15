import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { interval, Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { PendingActionsNotificaterService } from '../../Common/Components/PendingActions/pending-actions-notificater.service'
import { FileUploadPayerStep2Component } from './file-upload-payer-step2.component'
import { FileUploadStep1Component } from './file-upload-step1.component'
import { FileUploadStep2Component } from './file-upload-step2.component'
import { FileUploadStep3Component } from './file-upload-step3.component'
import { FileUploadService } from './file-upload.service'

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
  step2FileDirectDebit: FileUploadStep2Component
  @ViewChild(FileUploadPayerStep2Component)
  step2FilePayer: FileUploadPayerStep2Component
  @ViewChild(FileUploadStep3Component)
  step3FileDirectDebit: FileUploadStep1Component

  @ViewChild('reportPayerModal', { static: true })
  public reportPayerModal: ModalDirective
  @ViewChild('reportErrorTable') table: any

  reportErrorTable: any
  sub: Subscription
  type: string = null
  step: number
  payrollDetails: any
  mensajeError: any = {}
  subscriptions: Subscription[] = []
  DirectDebitFileUpload = 'directDebit'
  PayerFileUpload = 'payer'
  datos: any

  initDirectDebitPayment: any
  initPayer: any

  fileSystemName: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  file: File

  constructor(
    private route: ActivatedRoute,
    private serviceFileUpload: FileUploadService,
    public translate: TranslateService,
    public storage: StorageService,
    public pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super()
    this.step = 1

    this.datos = { fileName: '', linesWithError: '', lineValidationList: [] }
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
          this.type = this.DirectDebitFileUpload
        }

        if (this.type === this.DirectDebitFileUpload) {
          this.initDirectDebitUploadFile()
        }

        if (this.type === this.PayerFileUpload) {
          ////console.log('employee file upload');
        }
      }),
    )
  }

  initDirectDebitUploadFile() {
    ////console.log('hago la llamada')
    /*this.subscriptions.push(this.serviceFileUpload.getPayrollDetails().subscribe(result => {
            if(result.hasOwnProperty('error') && (<any>result).error instanceof Exception){
                this.onError(result);
                return;
            } else {
                //
                this.payrollDetails = result;
            }
        }));*/
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  next() {
    if (this.type === this.DirectDebitFileUpload) {
      this.nextDirectDebitStep()
    } else {
      this.nextPayerStep()
    }
  }

  nextDirectDebitStep() {
    switch (this.step) {
      case 1:
        this.initDirectDebitPayment = {}

        this.file = this.step1FileUpload.file
        this.serviceFileUpload
          .uploadFileDirectDebit(this.file, this.step1FileUpload.batchName)
          .subscribe((result) => {
            if (
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              this.onError(result)
              return
            } else {
              this.initDirectDebitPayment = result
              //console.log(this.initDirectDebitPayment);
              if (this.initDirectDebitPayment.linesWithError > 0) {
                this.datos = this.initDirectDebitPayment
                this.reportPayerModal.show()
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initDirectDebitPayment.directDebit.cic = JSON.parse(
                  this.storage.retrieve('currentUser'),
                )['company']['profileNumber']
                this.initDirectDebitPayment.directDebit.companyName =
                  JSON.parse(this.storage.retrieve('currentUser'))['company'][
                    'companyName'
                  ]
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .saveDirectDebitFile(
            this.initDirectDebitPayment.directDebit,
            this.step2FileDirectDebit.requestValidate,
            this.initDirectDebitPayment.directDebitFileFormat,
            this.file,
          )
          .subscribe((result) => {
            if (
              result.errorCode != '0' ||
              result.hasOwnProperty('error') ||
              result.error instanceof Exception
          ) {
              this.onError(result)
              return
            } else {
              this.initDirectDebitPayment = result
              this.fileSystemName = result.fileName

              this.nextStep()
            }
          })
        break
      case 3:
        this.nextStep()
        break
    }
  }

  nextPayerStep() {
    switch (this.step) {
      case 1:
        this.initPayer = {}

        this.serviceFileUpload
          .uploadFilePayer(this.step1FileUpload.file)
          .subscribe((result) => {
            if (
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              this.onError(result)
              return
            } else {
              this.initPayer = result
              if (this.initPayer.linesWithError > 0) {
                this.datos = this.initPayer
                this.reportPayerModal.show()
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.nextStep()

                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .savePayerFile(this.initPayer.companyCustomersList)
          .subscribe((result) => {
            if (
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              this.onError(result)
              return
            } else {
              this.initPayer = result
              //
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
    //console.log('next step ', this.step);
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
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  isDisabled() {
    if (
      this.step1FileUpload &&
      this.step1FileUpload.file &&
      this.step1FileUpload.file.type === 'text/plain' &&
      ((this.type == this.DirectDebitFileUpload &&
        this.step1FileUpload.batchName &&
        this.step1FileUpload.batchName != '') ||
        this.type == this.PayerFileUpload)
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
    this.step2FileDirectDebit = events
  }

  onInitPayerStep2(events) {
    this.step2FilePayer = events
  }
}
