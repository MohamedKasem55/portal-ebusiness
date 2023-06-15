import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { Exception } from '../../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'

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

  requestReactivate: any = {}
  accounts: any

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  form: any

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
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getrecoverData()
    this.createForm(this.requestReactivate['initialBatch'])
    this.getAccounts()
  }

  getAccounts() {
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.accounts = result
        }
      }),
    )
  }

  createForm(data) {
    this.form = this.fb.group({
      account: [data.accountNumber, Validators.required],
      chequeNumber: [
        data.checkNumber,
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      amount: [
        data.amount,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    })
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.nextStep()
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .save(
                this.step2RequestReactivate.batch,
                this.step2RequestReactivate.requestValidate,
              )
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  this.option = null
                  return
                } else {
                  this.requestReactivate['initiate'] = result
                  this.generateChallengeAndOTP = result.generateChallengeAndOTP
                  this.initiateBatch =
                    this.requestReactivate['initiate'].aramcoBatch
                  this.nextStep()
                }
              }),
          )
        } else if (this.option == this.DeleteOption) {
          this.subscriptions.push(
            this.service
              .delete(this.requestReactivate['initialBatch'])
              .subscribe((result) => {
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
        this.nextStep()
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

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.step1RequestReactivate.batch.accountNumber = this.form.value.account
    this.step1RequestReactivate.batch.checkNumber = this.form.value.chequeNumber
    this.step1RequestReactivate.batch.amount = this.form.value.amount

    this.subscriptions.push(
      this.service
        .validate(this.step1RequestReactivate.batch)
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
    this.router.navigate(['/chequebook/positive-payment/request-status'])
  }
  accept() {
    this.step = 1
    this.router.navigate(['/chequebook/positive-payment/request-status'])
  }
  reject() {
    this.step = 1
    this.router.navigate(['/chequebook/positive-payment/request-status'])
  }
  edit() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }
}
