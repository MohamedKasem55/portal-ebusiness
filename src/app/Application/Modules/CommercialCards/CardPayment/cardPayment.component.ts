import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { CommercialCardsService } from '../commercial-cards.service'
import { CardPaymentService } from './cardPayment.service'
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { CardPaymentStep1Component } from './cardPayment-step1.component'
import { CardPaymentStep3Component } from './cardPayment-step3.component'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import {
  BusinessCardsList,
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { CardPaymentStep2Component } from './cardPayment-step2.component'
@Component({
  selector: 'app-CardPayment',
  templateUrl: './cardPayment.component.html',
})
export class CardPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(CardPaymentStep1Component)
  step1: CardPaymentStep1Component
  @ViewChild(CardPaymentStep2Component)
  step2: CardPaymentStep2Component
  @ViewChild(CardPaymentStep3Component)
  step3: CardPaymentStep3Component

  public step: number
  public option: string
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public confirm: Subscription
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public batchListsContainer: any
  public businessCardObject: BusinessDetailAndList
  public form: any
  public businessCardList: BusinessCardsList
  public businessCardItem: BusinessCardsListItems
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private cardPaymentService: CardPaymentService,
    private commercialCardsService: CommercialCardsService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.form = fb.group(
      {
        paymentType: ['', Validators.required],
        amount: [{ value: '', disabled: true }],
        accountFrom: [''],
        response: [''],
      },
      { validator: this.validateFixedAmounts },
    )
  }

  validateFixedAmounts(group: AbstractControl): ValidationErrors | null {
    const paymentType: FormControl = group.get('paymentType') as FormControl
    const amount: FormControl = group.get('amount') as FormControl
    if (paymentType.value === 0 && +amount.value === 0) {
      return { invalidDueAmount: true }
    }
    if (paymentType.value === 1 && +amount.value === 0) {
      return { invalidOutstandingAmount: true }
    }
    if (paymentType.value === 2 && +amount.value === 0) {
      return { invalidCustomAmount: true }
    }
    if (
      paymentType.value === 2 &&
      +amount.value > CardPaymentService.MAX_PAYMENT_AMOUNT
    ) {
      return { exceedsCustomAmount: true }
    }
    return null
  }

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
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
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.cardPaymentService
            .validatePayment(this.form, this.businessCardObject)
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                return
              } else {
                this.mensajeError = {}
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.batchListsContainer = result.batchListsContainer
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.cardPaymentService
            .confirmPayment(
              this.step2.requestValidate,
              this.batchListsContainer,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                this.modalErrorCodeOTP.show()
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
      this.router.navigate(['businessCards/viewquerycards'])
    }
    if (this.step === 1) {
      this.form.controls['accountFrom'].value = ''
      this.form.controls['amount'].value = ''
      this.form.controls['paymentType'].value = ''
    }
    if (this.step === 2) {
      this.form['controls'].code.reset()
    }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/businessCards/viewquerycards'])
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

  tryAgain() {
    this.form['controls'].code.reset()
    this.modalErrorCodeOTP.hide()
    this.router.navigate(['/businessCards/activatecards'])
    this.step = 3
  }
  cancel() {
    this.form.reset()
    this.router.navigate(['/businessCards/viewquerycards'])
  }
}
