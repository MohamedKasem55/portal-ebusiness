import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { FileUploadEmployeeStep2Component } from './file-upload-employee-step2.component'
import { FileUploadStep1Component } from './file-upload-step1.component'
import { FileUploadStep2Component } from './file-upload-step2.component'
import { FileUploadStep3Component } from './file-upload-step3.component'
import { FileUploadService } from './file-upload.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../../Model/requestvalidateType'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadStep1Component) step1FileUpload: FileUploadStep1Component
  @ViewChild(FileUploadStep2Component) step2FileSalary: FileUploadStep2Component
  @ViewChild(FileUploadEmployeeStep2Component)
  step2FileEmployee: FileUploadEmployeeStep2Component
  @ViewChild(FileUploadStep3Component) step3FileSalary: FileUploadStep1Component

  @ViewChild('reportEmployeeModal', { static: true })
  public reportEmployeeModal: ModalDirective

  reportErrorTable: any
  sub: Subscription
  type: string = null
  step: number
  payrollDetails: any
  subscriptions: Subscription[] = []

  SalaryFileUpload = 'salary'
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
  ) {
    this.step = 1
  }

  ngOnInit() {
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
    this.subscriptions.push(
      this.serviceFileUpload.getPayrollDetails().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          //
          this.payrollDetails = result
        }
      }),
    )
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
            this.payrollDetails,
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
              if (this.initSalaryPayment.status == 'reportPage') {
                this.datos = this.initSalaryPayment
                this.reportEmployeeModal.show()
              } else {
                this.nextStep()
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .saveSalaryFile(
            this.initSalaryPayment.payrollBatchDTO,
            this.initSalaryPayment.salaryPaymentDetailsDTO,
            this.requestValidate,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initSalaryPayment = result
              this.confirmPaymentResponse = result
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
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
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.requestValidate = new RequestValidate()
              if (this.initEmployee.status == 'reportPage') {
                this.datos = this.initEmployee
                this.reportEmployeeModal.show()
              } else {
                this.nextStep()
              }
            }
          })
        break
      case 2:
        this.serviceFileUpload
          .saveEmployFile(this.initEmployee.companyEmployeeDTOList)
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.initEmployee = result
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
  }

  onError(error: any) {
    //console.log(res.error);
  }

  isDisabled() {
    if (this.step == 1) {
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
    }
    if (this.step == 2 && typeof this.step2FileSalary != 'undefined') {
      return !this.step2FileSalary.valid()
    }
    if (this.step == 2 && typeof this.step2FileEmployee != 'undefined') {
      return !this.step2FileEmployee.valid()
    }

    return true
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
