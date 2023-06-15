import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { CreditCardCancellationService } from './credit-card-cancellation.service'
import { CreditCardCancellationStep1Component } from './Steps/Step1/credit-card-cancellation-step1.component'
import { CreditCardCancellationStep2Component } from './Steps/Step2/credit-card-cancellation-step2.component'
import { CreditCardCancellationStep3Component } from './Steps/Step3/credit-card-cancellation-step3.component'

@Component({
  selector: 'app-credit-cards-cancellation-wizard',
  templateUrl: './credit-card-cancellation.component.html',
  styleUrls: ['./credit-card-cancellation.component.scss'],
})
export class CreditCardCancellationComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CreditCardCancellationStep1Component)
  step1: CreditCardCancellationStep1Component
  @ViewChild(CreditCardCancellationStep2Component)
  step2: CreditCardCancellationStep2Component
  @ViewChild(CreditCardCancellationStep3Component)
  step3: CreditCardCancellationStep3Component

  @Input()
  selectedCard: any

  cards: any[]

  constructor(
    public fb: FormBuilder,
    public service: CreditCardCancellationService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.formModel = this.fb.group({
      card: ['', Validators.required],
    })
  }

  ngOnInit() {
    super.ngOnInit()

    if (this.selectedCard) {
      this.cards = [this.selectedCard]
      this.wizardStep = 1
    } else {
      this.subscriptions.push(
        this.service.init().subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.cards = result.creditCardList.cardsList
            this.wizardStep = 1
          }
        }),
      )
    }
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
    const cardPos = this.formModel.controls.card.value
    const card = cardPos != null ? this.cards[cardPos] : null
    switch (this.wizardStep) {
      case 1:
        this.subscriptions.push(
          this.service.step(1, { card }).subscribe((result) => {
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
          this.service.confirm({ card }).subscribe((result) => {
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
    if (this.selectedCard != null) {
      this.ngOnInit()
    } else {
      this.router.navigate(['/credit-cards/list'])
    }
  }

  finish() {
    super.finish()
    //this.service.clearData();
    this.formModel.reset()
    this.wizardStep = 1
    if (this.selectedCard != null) {
      this.ngOnInit()
    } else {
      this.router.navigate(['/credit-cards/list'])
    }
  }
}
