import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { DebitCardAdjustPosService } from './debit-card-adjust-pos.service'
import { RequestValidate } from '../../../../Model/requestvalidateType'

@Component({
  selector: 'app-debit-card-adjust-pos',
  templateUrl: './debit-card-adjust-pos.component.html',
  styleUrls: ['./debit-card-adjust-pos.component.scss'],
})
export class DebitCardAdjustPosComponent
  extends AbstractWizardComponent
  implements OnChanges, OnDestroy
{
  @Input() set selectedCard(values: any) {
    this._selectedCard = values
    this.getCardLimits(this._selectedCard)
  }

  _selectedCard: any

  staticLimits: any

  posLimits: any

  formData: any

  constructor(
    public fb: FormBuilder,
    public service: DebitCardAdjustPosService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.formData = {}

    this.formModel = this.fb.group({
      cardNum: [''],
      posDomesticLimit: ['', Validators.required],
      posInternationalLimit: ['', Validators.required],
    })
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    if (this._selectedCard) {
      super.ngOnInit()
      this.subscriptions.push(
        this.service.init({ card: this._selectedCard }).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.staticLimits = result?.debitCard?.limits
            this.wizardStep = 1
            this.subscriptions.push(this.getCardLimits(this._selectedCard))
          }
        }),
      )
    }
  }

  getCardLimits(selectedCard: any) {
    return this.service
      .posLimitDTO({ card: selectedCard })
      .subscribe((result2) => {
        if (result2 === null) {
          this.onError(result2)
        } else {
          this.posLimits = result2
          this.setPosLimits(this.posLimits)
        }
      })
  }

  setPosLimits(posLimits: any) {
    this.formModel
      .get('posDomesticLimit')
      .setValue(posLimits.posDomesticLimit.amount)
    this.formModel
      .get('posInternationalLimit')
      .setValue(posLimits.pOsInternationalLimit.amount)
  }

  insertString(main_string, ins_string, pos) {
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  previous() {
    this.markPreviousWizardStep()
    this.formModel.enable()
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.markNextWizardStep()
        this.formModel.disable()
        break
      case 2:
        this.formData = Object.assign({}, this.formModel.value)
        this.subscriptions.push(
          this.service
            .confirm({
              cardNumber: this._selectedCard.cardNum,
              cardSeqNumber: this._selectedCard.cardSeqNum,
              ...this.posLimits,
              posDomesticLimit: {
                amount: this.formData.posDomesticLimit,
                currency: 'SAR',
              },
              posInternationalLimit: {
                amount: this.formData.posInternationalLimit,
                currency: 'SAR',
              },
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

  isDisabled() {
    let enabled = true
    switch (this.wizardStep) {
      case 1:
        enabled = this.formModel && this.formModel.valid
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
    this.wizardStep = 1
  }

  finish() {
    super.finish()
    this.formModel.reset()
    this.router.navigate(['/'])
  }
}
