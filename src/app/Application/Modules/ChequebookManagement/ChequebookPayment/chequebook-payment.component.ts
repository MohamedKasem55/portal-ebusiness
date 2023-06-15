import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../core/storage/storage.service'
import { ChequebookPaymentStep1Component } from './chequebook-payment-step1.component'
import { ChequebookPaymentStep2Component } from './chequebook-payment-step2.component'
import { ChequebookPaymentService } from './chequebook-payment.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-chequebook-payment',
  templateUrl: './chequebook-payment.component.html',
  styleUrls: ['./chequebook-payment.component.scss'],
})
export class ChequebookPaymentComponent implements OnInit, OnDestroy {
  @ViewChild(ChequebookPaymentStep1Component)
  step1: ChequebookPaymentStep1Component
  @ViewChild(ChequebookPaymentStep2Component)
  step2: ChequebookPaymentStep2Component

  step: number
  option: string

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: ChequebookPaymentService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = fb.group({
      account: [''],
      chequeNumber: [''],
      numberFrom: [''],
      numberTo: [''],
      amountFrom: [''],
      amountTo: [''],
      status: [''],
    })
  }

  ngOnInit() {}

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2 = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.nextStep()
        break
      case 2:
        this.nextStep()
        break
      case 3:
        this.finish()
        break
    }
  }

  stop() {
    this.option = 's'
    this.next()
  }

  cancelStop() {
    this.option = 'c'
    this.next()
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

  finish() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook'])
  }

  isDisabled() {
    return false
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
}
