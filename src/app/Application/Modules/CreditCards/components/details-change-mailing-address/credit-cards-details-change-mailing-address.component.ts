import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { CreditCardsDetailsChangeMailingAddressService } from './credit-cards-details-change-mailing-address.service'
import { CreditCardsDetailsChangeMailingAddressStep1Component } from './Steps/Step1/credit-cards-details-change-mailing-address-step1.component'
import { CreditCardsDetailsChangeMailingAddressStep2Component } from './Steps/Step2/credit-cards-details-change-mailing-address-step2.component'
import { CreditCardsDetailsChangeMailingAddressStep3Component } from './Steps/Step3/credit-cards-details-change-mailing-address-step3.component'

@Component({
  selector: 'app-credit-cards-details-change-mailing-address',
  templateUrl: './credit-cards-details-change-mailing-address.component.html',
  styleUrls: ['./credit-cards-details-change-mailing-address.component.scss'],
})
export class CreditCardsDetailsChangeMailingAddressComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CreditCardsDetailsChangeMailingAddressStep1Component)
  step1: CreditCardsDetailsChangeMailingAddressStep1Component
  @ViewChild(CreditCardsDetailsChangeMailingAddressStep2Component)
  step2: CreditCardsDetailsChangeMailingAddressStep2Component
  @ViewChild(CreditCardsDetailsChangeMailingAddressStep3Component)
  step3: CreditCardsDetailsChangeMailingAddressStep3Component

  @Input()
  selectedCard: any

  inquiryMailingData: any
  combosData: any

  formData: any

  constructor(
    public fb: FormBuilder,
    public service: CreditCardsDetailsChangeMailingAddressService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)

    this.inquiryMailingData = null
    this.combosData = {}
    this.formData = {}

    this.initForm(null)
  }

  ngOnInit() {
    super.ngOnInit()

    this.subscriptions.push(
      this.service.init({ card: this.selectedCard }).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.inquiryMailingData = result.creditCardDetails
          this.wizardStep = 1
          this.initForm(this.inquiryMailingData)

          const combosKeys = ['phoneNumAreaCode', 'regionType', 'cityType']
          this.subscriptions.push(
            this.staticService
              .getAllCombosAsArrays(combosKeys, true)
              .subscribe((resultC) => {
                if (resultC === null) {
                  this.onError(resultC)
                } else {
                  const data: Object = resultC
                  this.combosData = data
                }
              }),
          )
        }
      }),
    )
  }

  initForm(initialData) {
    const empty = initialData == null || Object.keys(initialData).length == 0

    this.formModel = this.fb.group({
      addressLine: [
        empty ? '' : initialData.addressLineOne,
        [Validators.required],
      ],
      cityRegion: [empty ? '' : initialData.address.region, []],
      city: [empty ? '' : initialData.address.city, [Validators.required]],
      zipCode: [
        empty ? '' : initialData.address.zipCode,
        [Validators.required],
      ],
      poBox: [empty ? '' : initialData.address.poBox, [Validators.required]],

      mail: [empty ? '' : initialData.mail, [Validators.email]],

      mainPhoneUnvalidateAreaCode: [
        empty ? '' : initialData.mainPhone.unvalidatedareaCode,
        [Validators.required],
      ],
      mainPhoneNumber: [
        empty ? '' : initialData.mainPhone.number,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      mainPhoneExtension: [
        empty ? '' : initialData.mainPhone.extension,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      mainPhoneInternationalCode: [
        empty ? '' : initialData.mainPhone.internationalCode,
        [],
      ],

      secondaryUnvalidateAreaCode: [
        empty ? '' : initialData.secondaryPhone.unvalidatedareaCode,
        [Validators.required],
      ],
      secondaryPhoneNumber: [
        empty ? '' : initialData.secondaryPhone.number,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      secondaryPhoneExtension: [
        empty ? '' : initialData.secondaryPhone.extension,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      secondaryPhoneInternationalCode: [
        empty ? '' : initialData.secondaryPhone.internationalCode,
        [],
      ],

      faxUnvalidateAreaCode: [
        empty ? '' : initialData.fax.unvalidatedareaCode,
        [Validators.required],
      ],
      faxNumber: [
        empty ? '' : initialData.fax.number,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      faxExtension: [
        empty ? '' : initialData.fax.extension,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      faxInternationalCode: [
        empty ? '' : initialData.fax.internationalCode,
        [],
      ],

      mobileUnvalidateAreaCode: [
        empty ? '' : initialData.mobile.unvalidatedareaCode,
        [
          Validators.minLength(10),
          Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
        ],
      ],
      mobileInternationalCode: [
        empty ? '' : initialData.mobile.internationalCode,
        [],
      ],
    })
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
        this.subscriptions.push(
          this.service
            .step(1, { card: this.selectedCard })
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
        this.formData = Object.assign({}, this.formModel.value)
        this.subscriptions.push(
          this.service
            .completeFormData({ formData: this.formData })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.validationResponse = result

                const completedCreditCardDetails = result.creditCardDetails

                this.subscriptions.push(
                  this.service
                    .confirm({
                      card: this.selectedCard,
                      creditCardDetails: completedCreditCardDetails,
                    })
                    .subscribe((result2) => {
                      if (result2['errorCode'] != '0') {
                        this.onError(result2)
                      } else {
                        this.confirmResponse = result2
                        this.markNextWizardStep()
                      }
                    }),
                )
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
