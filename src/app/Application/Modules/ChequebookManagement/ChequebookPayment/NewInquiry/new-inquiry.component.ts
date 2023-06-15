import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { TranslateService } from '@ngx-translate/core'
import { NewInquiryStep1Component } from './new-inquiry-step1.component'
import { NewInquiryStep2Component } from './new-inquiry-step2.component'
import { NewInquiryService } from './new-inquiry.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-new-inquiry',
  templateUrl: './new-inquiry.component.html',
})
export class NewInquiryComponent implements OnInit, OnDestroy {
  @ViewChild(NewInquiryStep1Component) newInquiryStep1: NewInquiryStep1Component
  @ViewChild(NewInquiryStep2Component) newInquiryStep2: NewInquiryStep2Component

  step: number
  option: string

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  form: FormGroup

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    public service: NewInquiryService,
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
    this.newInquiryStep1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.newInquiryStep2 = events
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
