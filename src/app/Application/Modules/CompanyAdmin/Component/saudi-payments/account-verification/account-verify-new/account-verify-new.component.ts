import { Component, OnInit } from '@angular/core';
import {AbstractWizardComponent} from "../../../../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AccountVerifyNewService} from "./account-verify-new.service";
import {ProxyTypes} from "../../../../../Transfers/Model/ProxyTypes";
import {AccountBalanceService} from "../../../../../Home/Services/account-balance-service";
import {AccountVerifyConfirmReq, AccountVerifyValidateReq} from "../../models/account-verify";
import {ResponseGenerateChallenge} from "../../../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../../../Model/requestvalidateType";
import {Account} from "../../../../../../Model/account";
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';

@Component({
  selector: 'arb-account-verify-new',
  templateUrl: './account-verify-new.component.html',
  styleUrls: ['./account-verify-new.component.scss']
})
export class AccountVerifyNewComponent extends AbstractWizardComponent implements OnInit {

  formModel: FormGroup
  proxyTypes: any[]
  selectedProxyType: any
  accounts
  selectedAccount: string
  isAccountSelectDisabled = false

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate = new RequestValidate()
  fees

  banksCode: string[] = []

  constructor(
      public fb: FormBuilder,
      public translate: TranslateService,
      public router: Router,
      public service: AccountVerifyNewService,
      public accountBalanceService: AccountBalanceService,
      public staticService: StaticService
  ) {
    super(fb, translate, router)
    this.formModel = this.service.formModel
    this.proxyTypes =  new ProxyTypes(['CR_OR_UNN', 'ID_IQAMA']).proxyTypes
  }

  ngOnInit(): void {
    this.accountBalanceService
        .getAccounts('ECAL')
        .subscribe((result) => {
          if (result) {
            this.accounts = result
          }
        })

    this.refreshData()
  }

  back() {
    switch (this.wizardStep) {
      case 2:
        this.formModel.enable()
        this.formModel.get('bankName').disable()
        this.isAccountSelectDisabled = false
        this.markPreviousWizardStep()
        break
    }
  }

  getWizardStepsCount() {
  }

  isDisabled() {
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        const validateReq: AccountVerifyValidateReq = {
          beneficiaryIban: this.formModel.get('beneficiaryIban').value,
          beneficiaryId: this.formModel.get('beneficiaryId').value,
          remitterIban: this.formModel.get("remitterIban").value,
          remitterFullAccountNumber: this.selectedAccount
        }

        this.service.accountVerifyValidate(validateReq).subscribe(result => {
          if(result && result.errorCode == '0'){
            this.formModel.disable()
            this.isAccountSelectDisabled = true
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.fees = result.fees
            this.markNextWizardStep()
          }
        })
        break
      case 2:
        const confirmReq: AccountVerifyConfirmReq = {
          beneficiaryIban: this.formModel.get('beneficiaryIban').value,
          beneficiaryId: this.formModel.get('beneficiaryId').value,
          remitterIban: this.formModel.get("remitterIban").value,
          remitterFullAccountNumber: this.selectedAccount,
          requestValidate: this.requestValidate
        }

        this.service.accountVerifyConfirm(confirmReq).subscribe(result => {
          if(result && result.errorCode == '0'){
            this.markNextWizardStep()
          }
        })
    }
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  canGoBack(){
    return this.wizardStep == 2
  }

  canGoNext(){
    switch (this.wizardStep) {
      case 1:
        return this.formModel.valid && this.selectedAccount
      case 2:
        return this.requestValidate.valid()
    }
  }

  validate(){

  }

  confirm(){

  }

  routeToRoot(){
    this.router.navigateByUrl('/')
  }

  routeToList(){
    this.router.navigateByUrl('/companyadmin/saudi-payments/account-verification/list')
  }

  selectProxy(proxyType){
    this.selectedProxyType = proxyType

    this.formModel
        .get('beneficiaryId')
        .setValidators([
          Validators.pattern(proxyType.pattern),
          Validators.required,
          Validators.maxLength(proxyType.max),
          Validators.minLength(proxyType.min)
        ])
    this.formModel.get('beneficiaryId').updateValueAndValidity()
  }

  onAccountChange(account: Account){
    this.formModel.get("remitterIban").setValue(account?.ibanNumber)
  }

  focusOutIbanAccountEvent(event): void {
    if (event) {
      this.focusOutIbanAccount(event.value)
    }
  }

  focusOutIbanAccount(value: string): void {
    const bankIbanCodeTmp = value?.substring(4, 6)
    const bankIbanCode = '0' + bankIbanCodeTmp
    if (bankIbanCode === '080') {
      this.formModel.get('beneficiaryIban').setErrors({alrajhiIBAN: true})
    }else{
      this.formModel.get('beneficiaryIban').setErrors(null)
    }
    this.formModel.get('bankName').setValue(this.banksCode[bankIbanCode])
  }

  refreshData() {
    const combosSolicitados = ['bankCode']

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.banksCode = data[combosSolicitados.indexOf('bankCode')]['values']
        this.focusOutIbanAccount(this.formModel.get('beneficiaryIban').value)
      })
  }
}
