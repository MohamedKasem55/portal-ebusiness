import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { DebitCardECommerceService } from './debit-card-e-commerce.service'

@Component({
  selector: 'app-debit-card-e-commerce',
  templateUrl: './debit-card-e-commerce.component.html',
  styleUrls: ['./debit-card-e-commerce.component.scss'],
})
export class DebitCardECommerceComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @Input() set selectedCard(values: any) {
    this._selectedCard = values
    this.setEcommerceValue(this._selectedCard)
  }

  enableECommerce: boolean
  _selectedCard: any
  acceptTC: any

  constructor(
    public fb: FormBuilder,
    public service: DebitCardECommerceService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public debitCardECommerceService: DebitCardECommerceService,
  ) {
    super(fb, translate, router)

    this.formModel = this.fb.group({
      enableECommerce: [false],
      acceptTC: [false, Validators.required],
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
        this.formModel.disable()
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm({
              card: this._selectedCard,
              enableECommerce: this.enableECommerce,
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

  setEcommerceValue(selectedCard: any) {
    this.enableECommerce = selectedCard.secureFlg === 'Y' ? true : false
  }

  getWizardStepsCount() {
    this.wizardStepsCount = 3
    return this.wizardStepsCount
  }

  onInitStep(step, events) {}

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

  isDisabled(): boolean {
    let enabled = true
    switch (this.wizardStep) {
      case 1:
        enabled = this.acceptTC
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
    // this.formModel.reset()
    this.formModel.enable()
    this.wizardStep = 1
    this.ngOnInit()
  }

  finish() {
    super.finish()
    this.formModel.reset()
    this.router.navigate(['/'])
  }
}
