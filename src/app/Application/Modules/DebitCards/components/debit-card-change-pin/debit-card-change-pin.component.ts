import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { DebitCardChangePinService } from './debit-card-change-pin.service'
import { DebitCardChangePinStep1Component } from './Steps/Step1/debit-card-change-pin-step1.component'
import { DebitCardChangePinStep2Component } from './Steps/Step2/debit-card-change-pin-step2.component'
import { DebitCardChangePinStep4Component } from './Steps/Step4/debit-card-change-pin-step4.component'
import { CryptoService } from '../../../../../core/crypto/crypto.service'
import { RequestValidate } from '../../../../Model/requestvalidateType'
import { DebitCardChangePinStep3Component } from './Steps/Step3/debit-card-change-pin-step3.component'

@Component({
  selector: 'app-debit-card-change-pin',
  templateUrl: './debit-card-change-pin.component.html',
  styleUrls: ['./debit-card-change-pin.component.scss'],
})
export class DebitCardChangePinComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: DebitCardChangePinStep1Component
  step2: DebitCardChangePinStep2Component
  step3: DebitCardChangePinStep3Component
  step4: DebitCardChangePinStep4Component

  @Input()
  selectedCard: any

  formData: any

  constructor(
    public fb: FormBuilder,
    public service: DebitCardChangePinService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private cryptoService: CryptoService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.formData = {}

    this.formModel = this.fb.group({
      cardNum: [''],
      newPin: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0) /*Validators.max(this.card.transferLimit),*/,
        ],
      ],
      confirmNewPin: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0) /*Validators.max(this.card.transferLimit),*/,
        ],
      ],
    })
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getWizardStepsCount() {
    this.wizardStepsCount = 4
    return this.wizardStepsCount
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
        this.service.validate({}).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.validationResponse = result
            this.markNextWizardStep()
          }
        })
        break
      case 3:
        this.formData = Object.assign({}, this.formModel.value)
        this.subscriptions.push(
          this.service
            .confirm({
              requestValidate: this.requestValidate,
              card: this.selectedCard,
              currentPin: this.cryptoService.encryptRSA(
                this.formData.currentPin,
              ),
              newPin: this.cryptoService.encryptRSA(this.formData.newPin),
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
      case 4:
        this.finish()
        break
    }
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
      case 4:
        this.step4 = events
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
      case 3:
        enabled = this.step3.valid()
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
  }

  finish() {
    super.finish()
    this.formModel.reset()
    this.router.navigate(['/'])
  }
}
