import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { SalaryPaymentsStep1Component } from './salary-payments-step1.component'
import { SalaryPaymentsStep2Component } from './salary-payments-step2.component'
import { SalaryPaymentsService } from './salary-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { HijraDateFormatPipe } from '../../../../Components/common/Pipes/hijra-date-format-pipe'

const moment = require('moment-hijri')

@Component({
  selector: 'app-salary-payments',
  templateUrl: './salary-payments.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsComponent implements OnInit, OnDestroy {
  @ViewChild(SalaryPaymentsStep1Component)
  step1SalaryPayments: SalaryPaymentsStep1Component
  @ViewChild(SalaryPaymentsStep2Component)
  step2SalaryPayments: SalaryPaymentsStep2Component

  step: number
  subscriptions: Subscription[] = []
  mensajeError: any = {}

  initSalaryPayment: any
  employeeData: any
  payrollDetails: any
  formSalary: FormGroup

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  accounts: any = []

  bank: any = []
  tableSelectedRows: any = []

  constructor(
    public service: SalaryPaymentsService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private injector: Injector,
  ) {
    this.step = 1
    const hijra = new HijraDateFormatPipe(this.injector)
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.formSalary = this.fb.group({
      accountFrom: ['', Validators.required],
      customerCIC: { value: '', disabled: true },
      organizationName: { value: '', disabled: true },
      valueDate: [hoy, Validators.required],
      hijraDate: { value: hijra.transform(hoy, 'dd/MM/yyyy'), disabled: true },
      batchName: ['', Validators.required],
      status: '',
    })
  }

  onInitStep1(events) {
    this.step1SalaryPayments = events
  }

  onInitStep2(events) {
    this.step2SalaryPayments = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .validateSalaryPayments(
              this.formSalary.value,
              this.step1SalaryPayments.accounts[
                this.formSalary.value.accountFrom
              ],
              this.step1SalaryPayments.employeeData,
              this.step1SalaryPayments.tableSelectedRows,
            )
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                this.onError(result)
                return
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initSalaryPayment = result

                const initResp =
                  this.initSalaryPayment.salaryPaymentDetailsDTO
                    .initiationResponseRecordWSDTO
                if (initResp) {
                  this.formSalary.controls.status.setValue(initResp.status)
                }

                this.accounts = this.step1SalaryPayments.accounts
                this.bank = this.step1SalaryPayments.bank
                this.employeeData = this.step1SalaryPayments.employeeData
                this.payrollDetails = this.step1SalaryPayments.payrollDetails
                this.tableSelectedRows =
                  this.step1SalaryPayments.tableSelectedRows
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmBatchSalaryPayments(
              this.payrollDetails,
              this.employeeData,
              this.initSalaryPayment,
              this.tableSelectedRows,
              this.requestValidate,
            )
            .subscribe((result) => {
              if (
                result.hasOwnProperty('errorCode') &&
                (<any>result).errorCode !== '0'
              ) {
                return
              } else {
                this.nextStep()
              }
            }),
        )

        break
      case 3:
        this.router.navigate(['/payroll/payroll-management'])
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
    // if (this.step == 1) {
    // 	this.tableSelectedRows = [];
    // }
  }

  isValidForm() {
    switch (this.step) {
      case 1:
        return this.validStep1()
      case 2:
        return typeof this.step2SalaryPayments === 'undefined'
          ? true
          : !this.step2SalaryPayments.valid()
    }
  }

  validStep1() {
    if (this.step1SalaryPayments != null) {
      return !(
        this.formSalary.valid &&
        this.step1SalaryPayments.tableSelectedRows.length > 0
      )
    }
    return true
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
