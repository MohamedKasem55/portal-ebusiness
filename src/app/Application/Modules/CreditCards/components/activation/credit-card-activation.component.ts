import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { CreditCardActivationService } from './credit-card-activation.service'
import { CreditCardActivationStep1Component } from './Steps/Step1/credit-card-activation-step1.component'
import { CreditCardActivationStep2Component } from './Steps/Step2/credit-card-activation-step2.component'
import { CreditCardActivationStep3Component } from './Steps/Step3/credit-card-activation-step3.component'

@Component({
  selector: 'app-credit-cards-activation-wizard',
  templateUrl: './credit-card-activation.component.html',
  styleUrls: ['./credit-card-activation.component.scss'],
})
export class CreditCardActivationComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CreditCardActivationStep1Component)
  step1: CreditCardActivationStep1Component
  @ViewChild(CreditCardActivationStep2Component)
  step2: CreditCardActivationStep2Component
  @ViewChild(CreditCardActivationStep3Component)
  step3: CreditCardActivationStep3Component

  @Input()
  selectedCard: any

  cards: any[]

  constructor(
    public fb: FormBuilder,
    public service: CreditCardActivationService,
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
        'CreditCardsActivate',
        [],
        ['CcGroup'],
      )
    )
  }

  isNextAllowed(): boolean {
    return (
      super.isNextAllowed() &&
      this.authenticationService.activateOption(
        'CreditCardsActivate',
        [],
        ['CcGroup'],
      )
    )
  }

  isFinishAllowed(): boolean {
    return (
      super.isFinishAllowed() &&
      this.authenticationService.activateOption(
        'CreditCardsActivate',
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
