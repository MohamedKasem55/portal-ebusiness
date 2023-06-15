import {Component, Inject, Injector, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {AbstractWizardComponent} from "../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CreditCardsDetailsChangeMailingAddressService} from "../../CreditCards/components/details-change-mailing-address/credit-cards-details-change-mailing-address.service";
import {StaticService} from "../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../core/security/authentication.service";
import {Router} from "@angular/router";
import {BulkPaymentSelfOnboardService} from "./bulk-payment-self-onboard.service";
import {AccountBalanceService} from "../../Home/Services/account-balance-service";
import {AmountCurrencyPipe} from "../../../Components/common/Pipes/amount-currency.pipe";
import {ModelPipe} from "../../../Components/common/Pipes/model-pipe";
import {RequestValidate} from "../../../Model/requestvalidateType";
import {confirmNewRegistrationReq, validateNewRegistrationReq} from "../models/self-onbaord.models";

@Component({
  selector: 'arb-bulk-payment-self-onboard',
  templateUrl: './bulk-payment-self-onboard.component.html',
  styleUrls: ['./bulk-payment-self-onboard.component.scss']
})
export class BulkPaymentSelfOnboardComponent extends AbstractWizardComponent implements OnInit {

  @ViewChild('notEligibleBlock') notEligibleBlock: any

  formModel: FormGroup
  accounts

  requestValidate: RequestValidate = new RequestValidate()
  validationResponse: any = null
  tcLink: string

  isEligible: boolean
  notEligibleReason: string

  constructor( public fb: FormBuilder,
               public service: BulkPaymentSelfOnboardService,
               public staticService: StaticService,
               public translate: TranslateService,
               public router: Router,
               private injector: Injector,
               @Inject(LOCALE_ID) private _locale: string,
               public modelPipe: ModelPipe
  ) {
    super(fb, translate, router)
    this.modelPipe = new ModelPipe(this.injector)
    this.formModel = this.service.getForm()
  }

  ngOnInit(): void {

    this.service.getSARAccounts().subscribe(result => {
      if(result.errorCode == '0'){
        this.accounts = result.listAlertsPermissionAccount
      }
    })
    this.service.initiateRequest().subscribe(result => {
      if (result.errorCode == '0'){
        this.isEligible = result.eligibleToRegister
        this.notEligibleReason = result.reason
        this.formModel.get('monthlyFees').patchValue(new AmountCurrencyPipe(this.injector, this._locale).transform(result?.fees?.monthlyFees) + " SAR")
        this.formModel.get('transferFess').patchValue(new AmountCurrencyPipe(this.injector, this._locale).transform(result?.fees?.rajhiTxFees) + " SAR")
      }
    });
  }

  back() {
    switch (this.wizardStep) {
      case 2:
        this.formModel.controls['ibanNumber'].enable()
        this.wizardStep--
        break
    }
  }

  getWizardStepsCount() {
  }

  isDisabled() {
    switch (this.wizardStep) {
      case 1:
        return this.formModel.invalid
      case 2:
        return !this.requestValidate.valid()
      case 3:
    }
  }

  next() {
    switch (this.wizardStep) {
      case 1:

        const validateReq: validateNewRegistrationReq = {
          ibanNumber: this.formModel.get('ibanNumber').value
        }
        this.service.validateNewRegistration(validateReq).subscribe(result => {
          if(result.errorCode == '0'){
            this.validationResponse = result
            this.wizardStep++
            this.formModel.disable()
          }
        })
        break
      case 2:

        const confirmReq: confirmNewRegistrationReq = {
          ibanNumber: this.formModel.get('ibanNumber').value,
          requestValidate: this.requestValidate
        }
        this.service.confirmNewRegistration(confirmReq).subscribe(result => {
          if(result.errorCode == '0'){
            this.wizardStep++
          }
        })
        break
    }
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  selectAccount(event){
    if(event?.ibanNumber){
      this.formModel.controls['ibanNumber'].patchValue(event.ibanNumber)
    }
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }
}
