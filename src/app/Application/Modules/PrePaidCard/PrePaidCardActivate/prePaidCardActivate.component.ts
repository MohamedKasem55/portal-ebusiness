import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
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
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { PrePaidCardActivateStep1Component } from './prePaidCardActivate-step1.component'
import { PrePaidCardActivateStep2Component } from './prePaidCardActivate-step2.component'
import { PrePaidCardActivateStep3Component } from './prePaidCardActivate-step3.component'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import { PrePaidCardService } from '../prePaidCard.service'
import { BusinessCardsDetails, TargetsData } from '../prePaidCardModels'
import { PrePaidCardActivateService } from './prePaidCardActivate.service'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
@Component({
  selector: 'app-PrePaidCardActivate',
  templateUrl: './prePaidCardActivate.component.html',
})
export class PrePaidCardActivateComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(PrePaidCardActivateStep1Component)
  step1: PrePaidCardActivateStep1Component
  @ViewChild(PrePaidCardActivateStep2Component)
  step2: PrePaidCardActivateStep2Component
  @ViewChild(PrePaidCardActivateStep3Component)
  step3: PrePaidCardActivateStep3Component

  step: number
  option: string
  public accountNumber: number
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public validateAccount: Subscription
  public validateOTP: Subscription
  public confirmActive: Subscription
  public prepaidCardSelected: PrepaidCardItem
  public validateActivate: Subscription
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public targetData: TargetsData
  public cardDetails: BusinessCardsDetails
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public prePaidCardActivateService: PrePaidCardActivateService,
    public prePaidCardService: PrePaidCardService,
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

  ngOnInit() {}

  getRoutes(): any[] {
    const routes = [
      ['prePaidCard.prePaidCardList', ['/prepaid-card/prepaidcardlist']],
      ['prePaidCard.cardActivation'],
    ]
    return routes
  }
  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }
  onInitStep3(events) {
    this.step3 = events
  }

  next() {
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.prePaidCardActivateService
            .validateActivate(this.prepaidCardSelected)
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
          this.prePaidCardActivateService
            .confirmActivate(
              this.prepaidCardSelected,
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
    this.step = ++this.step % 5
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 5
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
    if (this.step === 1) {
      this.resetFields(this.form, this.step)
    }
    if (this.step === 2) {
      this.resetFields(this.form, this.step)
    }
  }

  finish() {
    this.step = 1
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
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
    } else {
      return !this.form.valid
    }
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
  cardActivationError() {
    this.router.navigate(['/businessCards/menu'])
  }
  goActivateCards() {
    this.router.navigate(['/businessCards/activatecards'])
  }
  modalErrorhide() {
    this.resetFields(this.form, this.step)
    this.modalErrorAccount.hide()
  }
  // Validate Pin and repeat Pin
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

  tryAgain() {
    this.form['controls'].code.reset()
    this.modalErrorCodeOTP.hide()
    // this.step = 3;
    this.onInitStep2(this.form)
    // this.onInitStep3(Event);
    this.router.navigate(['/businessCards/activatecards'])
    this.step = 2
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
}
