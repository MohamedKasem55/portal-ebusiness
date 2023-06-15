import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
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

@UntilDestroy()
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy {
  @ViewChild(FileUploadStep1Component)
  step1FileUpload: FileUploadStep1Component
  @ViewChild(FileUploadStep2Component)
  step2FileSalary: FileUploadStep2Component
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
  mensajeError: any = {}
  subscriptions: Subscription[] = []
  SalaryFileUpload = 'salary'
  EmployeeFileUpload = 'employee'
  datos: any = {}
  initSalaryPayment: any
  initEmployee: any

  fileSystemName: any
  generateChallengeAndOTP: ResponseGenerateChallenge

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
          this.type = this.SalaryFileUpload
        }

        if (this.type === this.SalaryFileUpload) {
          this.initSalaryUploadFile()
        }

        if (this.type === this.EmployeeFileUpload) {
          //console.log('employee file upload');
        }
      }),
    )
  }

  initSalaryUploadFile() {
    //console.log('hago la llamada')
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
    if (this.type === this.SalaryFileUpload) {
      this.nextSalaryStep()
    } else {
      this.nextEmployeeStep()
    }
  }

  nextSalaryStep() {
    switch (this.step) {
      case 1:
        this.initSalaryPayment = {}
        this.datos = {}
        this.serviceFileUpload
          .uploadFileSalary(
            this.step1FileUpload.file,
            this.step1FileUpload.batchName,
            this.step1FileUpload.paymentPurpose
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initSalaryPayment = result
              //console.log(this.initSalaryPayment);
              if (this.initSalaryPayment.linesWithError > 0) {
                this.datos = this.initSalaryPayment
                this.reportEmployeeModal.show()
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
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
          .saveSalaryFile(
            this.initSalaryPayment.payrollBatch,
            this.step2FileSalary.requestValidate,
            this.initSalaryPayment.salaryPaymentDetails,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initSalaryPayment = result
              this.fileSystemName = result.fileName

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

  nextEmployeeStep() {
    switch (this.step) {
      case 1:
        this.initEmployee = {}
        this.datos = {}
        this.serviceFileUpload
          .uploadFileEmployees(this.step1FileUpload.file)
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initEmployee = result
              if (this.initEmployee.linesWithError > 0) {
                this.datos = this.initEmployee
                this.reportEmployeeModal.show()
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.nextStep()
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .saveEmployFile(this.initEmployee.companyEmployeeList)
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initEmployee = result
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
    if(res.error){
      this.mensajeError['code'] = res.error.errorCode
      this.mensajeError['description'] = res.error.errorDescription
    }

  }

  isDisabled() {
    if (
      this.step1FileUpload != null &&
      this.step1FileUpload.file != null &&
      ((this.type == this.SalaryFileUpload &&
        this.step1FileUpload.batchName != null &&
        this.step1FileUpload.batchName != '') ||
        this.type == this.EmployeeFileUpload)
    ) {
      return false
    }
    if (this.step == 2) {
      if (this.type === this.SalaryFileUpload) {
        return !this.step2FileSalary.valid();
      }
    }
    return false
  }

  onInitStep1(events) {
    this.step1FileUpload = events
  }

  onInitStep2(events) {
    this.step2FileSalary = events
  }

  onInitEmployeeStep2(events) {
    this.step2FileEmployee = events
  }
}
