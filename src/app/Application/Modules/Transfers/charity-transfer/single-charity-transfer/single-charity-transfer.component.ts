import { Component, OnInit } from '@angular/core';
import {AbstractWizardComponent} from "../../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {SingleCharityTransferService} from "./single-charity-transfer.service";
import {ModelService} from "../../../../Components/common/model.service";
import {Account} from "../../../../Model/account";
import {AccountBalanceService} from "../../../Home/Services/account-balance-service";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {SingleCharityTransferConfirm} from "../models/single-charity-transfer";
import {Observable} from "rxjs";

@Component({
  selector: 'arb-single-charity-transfer',
  templateUrl: './single-charity-transfer.component.html',
  styleUrls: ['./single-charity-transfer.component.scss']
})
export class SingleCharityTransferComponent extends AbstractWizardComponent implements OnInit {

  charityBaseModels: any;
  charityCategory:any;
  charityCategoryGroups: any[]= [];
  charityGroup: any;
  charityGroupAccounts: any[]= [];
  accounts: Account[] = [];

  formModel: FormGroup;
  generateChallengeAndOTP: ResponseGenerateChallenge = null;
  requestValidate: RequestValidate = new RequestValidate();
  charityGroupAccount: any;
  selectedAccount: any = {};
  language: string;

  constructor(
      public fb: FormBuilder,
      public translate: TranslateService,
      public router: Router,
      public service: SingleCharityTransferService,
      public accountBalanceService: AccountBalanceService,
      public modelService: ModelService,
  ) {
    super(fb, translate, router);
    this.getModelData()
  }

  ngOnInit(): void {
    this.formModel = this.service.getFormModel()
    this.service.getSARAccounts().subscribe(result => {
        this.accounts = result.listAlertsPermissionAccount;
    })
  }

  selectCategory(charityCategory: any){
    this.charityCategory=charityCategory;
    this.charityGroupAccount =[];
    this.charityGroup = null;
    this.charityGroupAccount = null;
    this.charityCategoryGroups = charityCategory?.value?.charityGroups;
  }

  selectGroup(charityGroup: any){
    this.charityGroup = charityGroup;
    this.charityGroupAccount = null;
    this.charityGroupAccounts = charityGroup.charityGroupAccounts;
  }

  selectGroupAccount(charityGroupAccount: any){
    this.charityGroupAccount = charityGroupAccount;
    this.formModel.get('accountNumberTo').setValue(charityGroupAccount.account)
  }

  selectAccount(account){
    this.selectedAccount = account;
    this.formModel.get('accountNumberFrom').setValue(account.fullAccountNumber)
  }

  back() {
    this.formModel.enable();
    this.generateChallengeAndOTP = null;
    this.requestValidate = new RequestValidate();
    this.wizardStep--;
  }

  getWizardStepsCount() {
  }

  isDisabled() {
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        if(this.formModel.valid){
          this.formModel.disable()
           this.service.validateSingleCharityTransfer().subscribe(result =>{
               if (result.errorCode === '0'){
                   this.generateChallengeAndOTP = result.generateChallengeAndOTP;
               }
           });
          this.markNextWizardStep()
        }
        break;
      case 2:
        if (this.validOTP()){
            const singleCharityTransferConfirm: SingleCharityTransferConfirm ={
                accountFrom: this.formModel.get("accountNumberFrom").value,
                transferAmount: this.formModel.get("transferAmount").value,
                remarks: this.formModel.get("remarks").value,
                accountTo:this.formModel.get("accountNumberTo").value,
                requestValidate: this.requestValidate
            }
            this.service.confirmSingleCharityTransfer(singleCharityTransferConfirm).subscribe(result =>{
                if (result.errorCode === '0'){
                    this.markNextWizardStep()
                }
            });
        }
    }
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  cancel() {
    this.router.navigateByUrl('/transfers/charity/community-services')
  }

    dashboard() {
        this.router.navigateByUrl('/')
    }
  canGoBack(){
    return this.wizardStep == 2
  }

  canGoNext(){
    switch (this.wizardStep) {
      case 1:
        return this.formModel.valid
      case 2:
        return this.validOTP()
      default:
        return false
    }
  }

  validOTP(){
      return this.requestValidate.valid()
  }
    getModel() {
        const modelData = this.modelService.getModel(this.language, 'charityCategories');
        if (modelData instanceof Observable) {
            modelData.subscribe(result => {
                this.charityBaseModels = result;
            })
        } else {
            this.charityBaseModels = modelData;
        }
    }
    private getModelData() {
        this.language = this.translate.currentLang;
        this.getModel();
        this.translate.onLangChange.subscribe(result => {
            this.language = result.lang;
            this.getModel()
        })
    }
}
