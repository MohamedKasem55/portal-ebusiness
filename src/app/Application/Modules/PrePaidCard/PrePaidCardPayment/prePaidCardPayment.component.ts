import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
import { PrePaidCardService } from '../prePaidCard.service'
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms'

import { Exception } from '../../../Model/exception'
import { PrePaidCardPaymentStep1Component } from './prePaidCardPayment-step1.component'
import { PrePaidCardPaymentStep2Component } from './prePaidCardPayment-step2.component'
import { PrePaidCardPaymentStep3Component } from './prePaidCardPayment-step3.component'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import {
  BatchListsContainer,
  BusinessCardsDetails,
  TargetsData,
} from '../prePaidCardModels'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { PrePaidCardPaymentService } from './prePaidCardPayment.service'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { PrepaidCardDetails } from '../PrePaidCardViewQuery/prePaidCardDetailModel'
@Component({
  selector: 'app-PrePaidCardPayment',
  templateUrl: './prePaidCardPayment.component.html',
  styleUrls: ['./prePaidCardPayment.component.scss'],
})
export class PrePaidCardPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(PrePaidCardPaymentStep1Component)
  step1: PrePaidCardPaymentStep1Component
  @ViewChild(PrePaidCardPaymentStep2Component)
  step2: PrePaidCardPaymentStep2Component
  @ViewChild(PrePaidCardPaymentStep3Component)
  step3: PrePaidCardPaymentStep3Component

  public step: number
  public option: string
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public targetData: TargetsData
  public cardDetails: BusinessCardsDetails
  public typeOperation: string
  public form: any
  public refundFundsType: string
  public loadFundsType: string
  public sharedData: any = {}
  public indexSelected: number
  public prepaidCardSelected: PrepaidCardItem
  public prepaidCardDetails: PrepaidCardDetails
  public batchListsContainer: BatchListsContainer
  public selectedId: string
  public buttonStep1: string
  public buttonStep2: string
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public prePaidCardService: PrePaidCardService,
    public prePaidCardPaymentService: PrePaidCardPaymentService,
    public storage: StorageService,
  ) {
    this.step = 1
    this.form = fb.group(
      {
        amount: [{ value: '', disabled: false }, Validators.required],
        accountFrom: [''],
        response: [''],
      },
      { validator: this.validateAmount },
    )
  }

  ngOnInit() {
    if (!this.prePaidCardService.getPrepaidCardSelected()) {
      // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
    }
    this.selectedId =
      this.prePaidCardService.getPrepaidCardSelected()?.cardSeqNumber

    this.refundFundsType = PrePaidCardPaymentService.REFUND_FUNDS_TYPE
    this.loadFundsType = PrePaidCardPaymentService.LOAD_FUNDS_TYPE
    this.typeOperation = this.prePaidCardService.getPaymentTypeFunds()
    if (this.typeOperation === PrePaidCardPaymentService.REFUND_FUNDS_TYPE) {
      this.buttonStep1 = 'commercialCards.cardRefund'
    } else {
      this.buttonStep1 = 'commercialCards.cardPayment'
    }
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
    this.prepaidCardDetails = this.prePaidCardService.getPreaidCardDetail()
    switch (this.step) {
      case 1:
        if (
          this.typeOperation === PrePaidCardPaymentService.REFUND_FUNDS_TYPE
        ) {
          this.buttonStep2 = 'commercialCards.refund'
          this.subscriptions.push(
            this.prePaidCardPaymentService
              .validatePaymentRefund(
                this.form,
                this.prepaidCardSelected,
                this.prepaidCardDetails,
                this.typeOperation,
              )
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
        } else {
          this.buttonStep2 = 'commercialCards.pay'
          this.subscriptions.push(
            this.prePaidCardPaymentService
              .validatePaymentLoad(
                this.form,
                this.prepaidCardSelected,
                this.prepaidCardDetails,
                this.typeOperation,
              )
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
        }
        break
      case 2:
        if (
          this.typeOperation === PrePaidCardPaymentService.REFUND_FUNDS_TYPE
        ) {
          this.subscriptions.push(
            this.prePaidCardPaymentService
              .confirmPaymentRefund(
                this.step2.requestValidate,
                this.batchListsContainer,
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
        } else {
          this.subscriptions.push(
            this.prePaidCardPaymentService
              .confirmPaymentLoad(
                this.step2.requestValidate,
                this.batchListsContainer,
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
        }

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
      this.router.navigate(['/prepaid-card/prepaidcardlist'])
    }
    if (this.step === 1) {
      this.form.controls['accountFrom'].value = ''
      this.form.controls['amount'].value = ''
    }
    if (this.step === 2) {
      this.form.controls.code.reset()
    }
  }

  finish() {
    this.step = 1
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
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

  tryAgain() {
    this.form['controls'].code.reset()
    this.modalErrorCodeOTP.hide()
    this.router.navigate(['/businessCards/activatecards'])
    this.step = 3
  }
  cancel() {
    this.form.reset()
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
  }

  validateAmount(group: AbstractControl): ValidationErrors | null {
    const amount: FormControl = group.get('amount') as FormControl

    if (+amount.value === 0) {
      return { invalidAmount: true }
    }

    return null
  }
}
