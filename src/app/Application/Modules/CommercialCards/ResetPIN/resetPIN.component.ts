import { CommercialCardsService } from '../commercial-cards.service'
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { ResetPINStep1Component } from './resetPIN-step1.component'
import { ResetPINStep2Component } from './resetPIN-step2.component'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import {
  BusinessCardsListItems,
  BusinessDetailAndList,
  BusinessCardsDetails,
} from '../commercial-cards-models'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResetPINService } from './resetPIN.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
@Component({
  selector: 'app-reset-card-pin',
  templateUrl: './resetPIN.component.html',
  styleUrls: ['./resetPIN.component.scss'],
})
export class ResetPINComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(ResetPINStep1Component)
  step1: ResetPINStep1Component
  @ViewChild(ResetPINStep2Component)
  step2: ResetPINStep2Component

  public step: number
  public option: string
  public businessCardObject: BusinessDetailAndList
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public businessCardsDetails: BusinessCardsDetails
  // 1 -> Reset Pin
  // 3 -> Change Pin
  // 3 -> New Pin
  public requestType: string
  public setOpType: string
  public resetOpType: string
  public businessCardList: BusinessCardsListItems
  public form: any

  constructor(
    fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public resetPinService: ResetPINService,
    public commercialCardsService: CommercialCardsService,
  ) {
    this.step = 1
    this.form = fb.group({
      newPin: fb.group({
        newPin1: ['', Validators.required],
        newPin2: ['', Validators.required],
        newPin3: ['', Validators.required],
        newPin4: ['', Validators.required],
      }),
      repeatNewPin: fb.group({
        repeatNewPin1: ['', Validators.required],
        repeatNewPin2: ['', Validators.required],
        repeatNewPin3: ['', Validators.required],
        repeatNewPin4: ['', Validators.required],
      }),
      response: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardList = this.businessCardObject.list
    this.businessCardsDetails =
      this.businessCardObject.details.businessCardsDetails
    this.setOpType = ResetPINService.SET_OP_TYPE
    this.resetOpType = ResetPINService.RESET_OP_TYPE
  }

  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }

  next() {
    this.requestType = this.resetPinService.getResetOperationType()
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.resetPinService.validateResetCard().subscribe((result) => {
            if (result.errorCode != '0') {
              this.onError(result)
              this.option = null
              this.resetFields(this.form, this.step)
            } else {
              this.mensajeError = {}
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.nextStep()
            }
          }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.resetPinService
            .confirmResetCard(
              this.form,
              this.businessCardList,
              +this.requestType,
              this.step2.requestValidate,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                // this.modalErrorCodeOTP.show();
              } else {
                this.mensajeError = {}
                this.nextStep()
              }
            }),
        )
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
    if (this.step === 1) {
      this.form.reset()
    }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/businessCards/viewquerycards'])
  }

  isDisabled() {
    if (this.step === 1) {
      if (!this.validatePin()) {
        return true
      } else {
        return false
      }
    }
    if (this.step === 2) {
      if (this.step2 && this.step2.valid()) {
        return false
      } else {
        return true
      }
    }
    return !this.form.valid
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }
  validatePin(): boolean {
    let pinNumber = ''
    let repeatPinNumber = ''
    let PinEqualRepeat = false
    if (
      this.form['controls'].repeatNewPin['controls']['repeatNewPin1'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin2'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin3'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin4'].value &&
      this.form['controls'].newPin['controls']['newPin1'].value &&
      this.form['controls'].newPin['controls']['newPin2'].value &&
      this.form['controls'].newPin['controls']['newPin3'].value &&
      this.form['controls'].newPin['controls']['newPin4'].value
    ) {
      for (let i = 1; i < 5; i++) {
        pinNumber =
          pinNumber +
          this.form['controls'].newPin['controls']['newPin' + i].value
        repeatPinNumber =
          repeatPinNumber +
          this.form['controls'].repeatNewPin['controls']['repeatNewPin' + i]
            .value
      }
      if (pinNumber == repeatPinNumber && pinNumber && repeatPinNumber) {
        PinEqualRepeat = true
      } else {
        PinEqualRepeat = false
      }
      return PinEqualRepeat
    } else {
      return PinEqualRepeat
    }
  }

  modalErrorhide() {
    this.form.controls.code.reset()
    this.modalErrorAccount.hide()
    this.modalErrorCodeOTP.hide()
  }
  cancel() {
    this.form.reset()
    this.router.navigate(['/businessCards/viewquerycards'])
  }
  resetFields(form: FormGroup, step: number): void {
    console.log('adsqwe')
    if (step === 1) {
      form['controls'].newPin.reset()
      form['controls'].repeatNewPin.reset()
    } else if (step === 2) {
      form['controls'].newPin.reset()
      form['controls'].repeatNewPin.reset()
      form['controls'].code.reset()
    }
  }
  tryAgain() {
    this.form.controls.code.reset()
    this.modalErrorCodeOTP.hide()
    this.onInitStep2(this.form)
    this.router.navigate(['/businessCards/resetpin'])
    this.step = 2
  }
}
