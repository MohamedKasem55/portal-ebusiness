import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStep1Component)
  step1RequestReactivate: RequestReactivateStep1Component
  @ViewChild(RequestReactivateStep2Component)
  step2RequestReactivate: RequestReactivateStep2Component

  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  salaryPayment: any
  paymentDate: any

  requestReactivate = {}
  accounts: any

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  form: FormGroup

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = this.fb.group({
      account: [null, Validators.required],
      amount: [null, Validators.required],
      customerName: [{ value: null, disabled: true }],
      customerId: [{ value: null, disabled: true }],
    })
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getPayment()

    this.accounts = this.extractAccountKeyValue(
      this.requestStatusService.getAccounts(),
    )
    this.createForm(this.requestReactivate['initialBatch'])
  }

  createForm(data) {
    this.form.controls['amount'].patchValue(data.amount)
    this.form.controls['customerName'].patchValue(null)
    this.form.controls['customerId'].patchValue(data.passNumber)
    this.form.controls['account'].patchValue(
      this.getKeyAccount(data.accountNumber),
    )
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  getKeyAccount(account: any) {
    if (account) {
      for (let i = this.accounts.length - 1; i >= 0; i--) {
        if (this.accounts[i].value.accountNumber == account.accountNumber) {
          return this.accounts[i].key
        }
      }
    }
    return
  }

  onInitStep1(events) {
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .save(
                this.initiateBatch,
                this.step2RequestReactivate.requestValidate,
              )
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  this.option = null
                  return
                } else {
                  this.requestReactivate['initiate'] = result
                  this.initiateBatch =
                    this.requestReactivate['initiate'].aramcoBatch
                  this.nextStep()
                }
              }),
          )
        } else if (this.option == this.DeleteOption) {
          this.subscriptions.push(
            this.service.delete(this.initiateBatch).subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                this.option = null
                return
              } else {
                this.nextStep()
              }
            }),
          )
        }
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
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  isValidStep1Form() {
    return this.step1RequestReactivate.valid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.subscriptions.push(
      this.service
        .validate(
          this.step1RequestReactivate.batch,
          this.form.value,
          this.accounts,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch = this.requestReactivate['initiate'].aramcoBatch
            this.nextStep()
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

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  finish() {
    this.step = 1
    this.router.navigate(['/aramcoPayments/request-status'])
  }
}
