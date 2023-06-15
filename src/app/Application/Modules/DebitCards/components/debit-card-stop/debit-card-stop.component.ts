import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { DebitCardStopService } from './debit-card-stop.service'
import { DebitCardStopStep1Component } from './Steps/Step1/debit-card-stop-step1.component'
import { DebitCardStopStep2Component } from './Steps/Step2/debit-card-stop-step2.component'
import { DebitCardStopStep3Component } from './Steps/Step3/debit-card-stop-step3.component'

@Component({
  selector: 'app-debit-card-stop',
  templateUrl: './debit-card-stop.component.html',
  styleUrls: ['./debit-card-stop.component.scss'],
})
export class DebitCardStopComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(DebitCardStopStep1Component)
  step1: DebitCardStopStep1Component
  @ViewChild(DebitCardStopStep2Component)
  step2: DebitCardStopStep2Component
  @ViewChild(DebitCardStopStep3Component)
  step3: DebitCardStopStep3Component
  @Input() selectedCard: any

  formData: any

  constructor(
    public fb: FormBuilder,
    public service: DebitCardStopService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.formData = {}

    this.formModel = this.fb.group({
      cardNum: [''],
      suspensionReason: ['', Validators.required],
    })
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  previous() {
    this.markPreviousWizardStep()
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.markNextWizardStep()
        break
      case 2:
        this.formData = Object.assign({}, this.formModel.value)
        this.subscriptions.push(
          this.service
            .confirm({
              card: this.selectedCard,
              suspensionReason: this.formData.suspensionReason,
            })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
                this.back()
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
        'DebitCardsMenu',
        [],
        ['CompanyAdmins'],
      )
    )
  }

  isNextAllowed(): boolean {
    return (
      super.isNextAllowed() &&
      this.authenticationService.activateOption(
        'DebitCardsMenu',
        [],
        ['CompanyAdmins'],
      )
    )
  }

  isFinishAllowed(): boolean {
    return (
      super.isFinishAllowed() &&
      this.authenticationService.activateOption(
        'DebitCardsMenu',
        [],
        ['CompanyAdmins'],
      )
    )
  }

  back() {
    this.formModel.reset()
    this.wizardStep = 1
    this.ngOnInit()
  }

  finish() {
    super.finish()
    //this.service.clearData();
    this.formModel.reset()
    this.wizardStep = 1
    this.ngOnInit()
  }
}
