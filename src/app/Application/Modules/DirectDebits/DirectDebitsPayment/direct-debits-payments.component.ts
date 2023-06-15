import { DatePipe } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { PendingActionsNotificaterService } from '../../Common/Components/PendingActions/pending-actions-notificater.service'
import { DirectDebitsPaymentsStep1Component } from './direct-debits-payments-step1.component'
import { DirectDebitsPaymentsStep2Component } from './direct-debits-payments-step2.component'
import { DirectDebitsPaymentsService } from './direct-debits-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

//const moment = require('moment-hijri');

@Component({
  selector: 'app-direct-debits-payments',
  templateUrl: './direct-debits-payments.component.html',
  styleUrls: ['./direct-debits-payments.component.scss'],
})
export class DirectDebitsPaymentsComponent implements OnInit, OnDestroy {
  @ViewChild(DirectDebitsPaymentsStep1Component)
  step1Component: DirectDebitsPaymentsStep1Component
  @ViewChild(DirectDebitsPaymentsStep2Component)
  step2Component: DirectDebitsPaymentsStep2Component

  step: number
  subscriptions: Subscription[] = []
  mensajeError: any = {}

  validData: any

  form: FormGroup
  fileSystemName: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  accounts: any = []

  bank: any = []
  tableSelectedRows: any = []
  salaryPaymentDetails: any

  constructor(
    public service: DirectDebitsPaymentsService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public pendingActionNotification: PendingActionsNotificaterService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = this.fb.group({
      customerCIC: { value: '', disabled: true },
      organizationName: { value: '', disabled: true },
      valueDate: [hoy, Validators.required],
      batchName: ['', Validators.required],
      customerReference: ['', Validators.maxLength(16)],
    })
  }

  onInitStep1(events) {
    this.step1Component = events
  }

  onInitStep2(events) {
    this.step2Component = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .validate(this.form.value, this.step1Component.tableSelectedRows)
            .subscribe((res) => {
              this.generateChallengeAndOTP = res.generateChallengeAndOTP
              this.validData = res
              this.bank = this.step1Component.bank
              this.tableSelectedRows = this.step1Component.tableSelectedRows
              if (
                !(this.validData.errors && this.validData.errors.length > 0)
              ) {
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm(this.validData.directDebit, this.requestValidate)
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                this.requestValidate = new RequestValidate()
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.onError(result)
                return
              } else {
                this.fileSystemName = result['fileName']
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )

        break
      case 3:
        this.pendingActionNotification.getRefreshObserver().next(true)
        this.router.navigate(['/direct-debits'])
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
        //console.log("valido", this.step2Component);
        return (
          !this.step2Component.valid() ||
          (this.validData.errors && this.validData.errors.length > 0)
        )
    }
  }

  validStep1() {
    if (this.step1Component != null) {
      return !(
        this.form.valid && this.step1Component.tableSelectedRows.length > 0
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
