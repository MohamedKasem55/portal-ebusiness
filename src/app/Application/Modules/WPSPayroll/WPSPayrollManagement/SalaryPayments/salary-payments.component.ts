import { DatePipe } from '@angular/common'
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
import { HijraDateFormatPipe } from '../../../../Components/common/Pipes/hijra-date-format-pipe'
import { Exception } from '../../../../Model/exception'
import { SalaryPaymentsStep1Component } from './salary-payments-step1.component'
import { SalaryPaymentsStep2Component } from './salary-payments-step2.component'
import { SalaryPaymentsService } from './salary-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AbstractAppComponent } from "../../../Common/Components/Abstract/abstract-app.component";

@Component({
  selector: 'app-salary-payments',
  templateUrl: './salary-payments.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsComponent extends AbstractAppComponent implements OnInit, OnDestroy {
  @ViewChild('focus_index', { static: true }) focus_index: any
  @ViewChild(SalaryPaymentsStep1Component)
  step1SalaryPayments: SalaryPaymentsStep1Component
  @ViewChild(SalaryPaymentsStep2Component)
  step2SalaryPayments: SalaryPaymentsStep2Component

  step: number

  initSalaryPayment: any
  employeeData: any
  payrollDetails: any
  formSalary: FormGroup
  fileSystemName: any = {}
  confirmResponse: any

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  accounts: any = []

  bank: any = []
  tableSelectedRows: any = []
  salaryPaymentDetails: any

  constructor(
    public service: SalaryPaymentsService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public datePipe: DatePipe,
    private injector: Injector,
  ) {
    super(translate);
    const hijra = new HijraDateFormatPipe(injector)
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.formSalary = this.fb.group({
      accountFrom: ['', Validators.required],
      customerCIC: { value: '', disabled: true },
      organizationName: { value: '', disabled: true },
      valueDate: [hoy, Validators.required],
      hijraDate: {
        // value: hoy,
        //value: new HijriDate().subtractDay().ignoreTime().format('dd/mm/yyyy'),
        value: hijra.transform(hoy, 'dd/MM/yyyy'),
        disabled: true,
      },
      batchName: ['', Validators.required],
      molId: ['', Validators.required],
      customerReference: ['', Validators.required],
      paymentPurpose: {
        value: 'PAYR',
        disabled: true,
        validators: Validators.required,
      },
      remarks: [''],
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
        this.step1SalaryPayments.payrollDetails.batchName =
          this.formSalary.controls.batchName.value
        this.step1SalaryPayments.payrollDetails.paymentDate =
          this.datePipe.transform(
            this.formSalary.controls.valueDate.value,
            'yyyy-MM-dd',
          )
        this.step1SalaryPayments.payrollDetails.paymentPurpose =
          this.formSalary.controls.paymentPurpose.value
        this.step1SalaryPayments.payrollDetails.customerReference =
          this.formSalary.controls.customerReference.value
        this.step1SalaryPayments.payrollDetails.remarks =
          this.formSalary.controls.remarks.value
        this.step1SalaryPayments.payrollDetails.molId =
          this.formSalary.controls.molId.value

        //console.log('this.step1SalaryPayments.payrollDetails.paymentDate',this.step1SalaryPayments.payrollDetails.paymentDate);
        this.subscriptions.push(
          this.service
            .validateSalaryPayments(
              this.step1SalaryPayments.accounts[
              this.formSalary.value.accountFrom
              ],
              this.step1SalaryPayments.payrollDetails,
              this.step1SalaryPayments.tableSelectedRows,
            )
            .subscribe((result) => {
              if (this.hasError(result)) {
                this.onError(result)
                return
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initSalaryPayment = result
                //this.formSalary.controls.status.setValue(this.initSalaryPayment.salaryPaymentDetails.initiationResponseRecordWSDTO.status);
                this.accounts = this.step1SalaryPayments.accounts
                this.bank = this.step1SalaryPayments.bank
                this.employeeData = this.step1SalaryPayments.employeeData
                this.payrollDetails = this.step1SalaryPayments.payrollDetails
                this.tableSelectedRows =
                  this.step1SalaryPayments.tableSelectedRows
                if (
                  !(
                    this.initSalaryPayment.errors &&
                    this.initSalaryPayment.errors.length > 0
                  )
                ) {
                  this.nextStep()
                } else {
                  setTimeout(() => {
                    this.focus_index.nativeElement.focus()
                  }, 200)
                }
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmSalaryPayments(
              this.initSalaryPayment.salaryPaymentDetails,
              this.tableSelectedRows,
              this.requestValidate,
            )
            .subscribe((result) => {
              if (this.hasError(result)) {
                this.onError(result)
                return
              } else {
                this.fileSystemName = result['fileName']
                this.confirmResponse = result
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.router.navigate(['/wpspayroll/wpspayroll-management'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    //
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

  isValidForm() {
    switch (this.step) {
      case 1:
        return this.validStep1()
      case 2:
        return !this.step2SalaryPayments.valid()
    }
  }


  validStep1() {
    if (this.step1SalaryPayments != null) {
      return !(
        this.formSalary.valid &&
        this.step1SalaryPayments.tableSelectedRows.length > 0 &&
        this.step1SalaryPayments.allSelectedRowsAreValid()
      )
    }
    return false
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
