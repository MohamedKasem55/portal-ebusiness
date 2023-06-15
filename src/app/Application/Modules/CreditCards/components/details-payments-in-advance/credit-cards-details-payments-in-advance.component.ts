import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { CreditCardsDetailsPaymentsInAdvanceService } from './credit-cards-details-payments-in-advance.service'
import { CreditCardsDetailsPaymentsInAdvanceStep1Component } from './Steps/Step1/credit-cards-details-payments-in-advance-step1.component'
import { CreditCardsDetailsPaymentsInAdvanceStep2Component } from './Steps/Step2/credit-cards-details-payments-in-advance-step2.component'
import { CreditCardsDetailsPaymentsInAdvanceStep3Component } from './Steps/Step3/credit-cards-details-payments-in-advance-step3.component'

@Component({
  selector: 'app-credit-cards-details-payments-in-advance',
  templateUrl: './credit-cards-details-payments-in-advance.component.html',
  styleUrls: ['./credit-cards-details-payments-in-advance.component.scss'],
})
export class CreditCardsDetailsPaymentsInAdvanceComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CreditCardsDetailsPaymentsInAdvanceStep1Component)
  step1: CreditCardsDetailsPaymentsInAdvanceStep1Component
  @ViewChild(CreditCardsDetailsPaymentsInAdvanceStep2Component)
  step2: CreditCardsDetailsPaymentsInAdvanceStep2Component
  @ViewChild(CreditCardsDetailsPaymentsInAdvanceStep3Component)
  step3: CreditCardsDetailsPaymentsInAdvanceStep3Component

  @Input()
  selectedCard: any

  utilPaymentData: any
  utilAccountList: any[]

  formData: any

  constructor(
    public fb: FormBuilder,
    public service: CreditCardsDetailsPaymentsInAdvanceService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.utilPaymentData = null
    this.utilAccountList = []
    this.formData = {}

    this.formModel = this.fb.group({
      account: ['', Validators.required],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*.?[0-9]*$'),
          Validators.min(0) /*Validators.max(this.card.transferLimit),*/,
        ],
      ],
    })
  }

  ngOnInit() {
    super.ngOnInit()

    this.subscriptions.push(
      this.service.init({ card: this.selectedCard }).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.utilPaymentData = result.creditCardAdvancedPayment
          this.wizardStep = 1
          this.subscriptions.push(
            this.service
              .accountsDTO({ card: this.selectedCard })
              .subscribe((result2) => {
                if (result2 === null) {
                  this.onError(result2)
                } else {
                  this.utilAccountList = result2.listAccount.filter(
                    (item, i) => item.currency == 608,
                  )
                }
              }),
          )
        }
      }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getWizardStepsCount() {
    this.wizardStepsCount = 3
    return this.wizardStepsCount
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
      case 3:
        this.step3 = events
        break
    }
  }

  isPreviousAllowed(): boolean {
    return (
      super.isPreviousAllowed() &&
      this.authenticationService.activateOption(
        'CreditCardsMenu',
        [],
        ['CcGroup'],
      )
    )
  }

  isNextAllowed(): boolean {
    return (
      super.isNextAllowed() &&
      this.authenticationService.activateOption(
        'CreditCardsMenu',
        [],
        ['CcGroup'],
      )
    )
  }

  isFinishAllowed(): boolean {
    return (
      super.isFinishAllowed() &&
      this.authenticationService.activateOption(
        'CreditCardsMenu',
        [],
        ['CcGroup'],
      )
    )
  }

  previous() {
    this.markPreviousWizardStep()
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.formData = Object.assign({}, this.formModel.value)
        this.subscriptions.push(
          this.service
            .step(1, {
              cardDTO: this.selectedCard,
              accountDTO: this.utilAccountList[this.formData.account],
              amount: this.formData.amount,
            })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm({
              cardDTO: this.selectedCard,
              accountDTO: this.utilAccountList[this.formData.account],
              amount: this.formData.amount,
            })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.confirmResponse = result
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 3:
        this.finish()
        break
    }
  }

  valid() {
    return true
  }

  isDisabled() {
    let enabled = true
    switch (this.wizardStep) {
      case 1:
        enabled =
          this.step1 && this.step1.formModel && this.step1.formModel.valid
        break
      case 2:
        enabled = this.valid()
        break
      default:
        break
    }
    return !enabled
  }

  back() {
    this.formModel.reset()
    this.wizardStep = 1
    this.ngOnInit()
    //this.router.navigate(['/credit-cards/details']);
  }

  finish() {
    super.finish()
    //this.service.clearData();
    this.formModel.reset()
    this.wizardStep = 1
    this.ngOnInit()
    //this.router.navigate(['/credit-cards/details']);
  }
}
