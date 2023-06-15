import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
import { PrePaidCardResetPINService } from './prePaidCardResetPin.service'
import { PrePaidCardService } from '../prePaidCard.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { PrePaidCardResetPinStep1Component } from './prePaidCardResetPin-step1.component'
import { PrePaidCardResetPinStep2Component } from './prePaidCardResetPin-step2.component'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import {
  BusinessCardsDetails,
  RequestType,
  TargetsData,
} from '../prePaidCardModels'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
@Component({
  selector: 'app-ActivateCards',
  templateUrl: './prePaidCardResetPin.component.html',
  styleUrls: ['./prePaidCardResetPin.component.scss'],
})
export class PrePaidCardResetPinComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(PrePaidCardResetPinStep1Component)
  step1: PrePaidCardResetPinStep1Component
  @ViewChild(PrePaidCardResetPinStep2Component)
  step2: PrePaidCardResetPinStep2Component

  step: number
  option: string

  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public targetData: TargetsData
  public cardDetails: BusinessCardsDetails
  public typeOperation: string
  public setOpType: string
  public resetOpType: string
  public prepaidCardSelected: PrepaidCardItem
  form: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public prePaidCardService: PrePaidCardService,
    public prePaidCardResetPINService: PrePaidCardResetPINService,
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
    })
  }

  ngOnInit() {
    this.setOpType = PrePaidCardResetPINService.SET_OP_TYPE
    this.resetOpType = PrePaidCardResetPINService.RESET_OP_TYPE
    if (!this.prePaidCardService.getPrepaidCardSelected()) {
      this.router.navigate(['/prepaid-card/prepaidcardlist'])
    }
  }

  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }

  next() {
    this.typeOperation = this.prePaidCardResetPINService.getResetOperationType()
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.prePaidCardResetPINService
            .validateResetCard(
              this.form,
              this.prepaidCardSelected,
              this.typeOperation,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                this.resetFields(this.form, this.step)
                return
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
          this.prePaidCardResetPINService
            .confirmResetCard(
              this.form,
              this.prepaidCardSelected,
              this.typeOperation,
              this.step2.requestValidate,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                // this.modalErrorCodeOTP.show();
                return
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
    // cambiar victor
    // this.router.navigate(['/prepaid-card/prepaidcardlist'])
  }

  isDisabled() {
    if (this.step === 1) {
      if (!this.validatePin()) {
        return true
      } else {
        return false
      }
    } else if (this.step === 2) {
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

  validateStep1fields(): boolean {
    let fieldFillAll = false
    for (let i = 6; i < 13; i++) {
      if (this.form['controls'].digit['controls']['digit' + i].value) {
        fieldFillAll = true
      } else {
        fieldFillAll = false
        break
      }
    }
    return fieldFillAll
  }

  modalErrorhide() {
    this.form.controls.code.reset()
    this.modalErrorAccount.hide()
    this.modalErrorCodeOTP.hide()
  }
  cancel() {
    this.form.reset()
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
  }
  resetFields(form: FormGroup, step: number): void {
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
