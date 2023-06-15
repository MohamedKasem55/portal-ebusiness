import { Component, OnInit } from '@angular/core';
import {AbstractWizardComponent} from "../../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {RequestNewDocumentService} from "./request-new-document.service";

@Component({
  selector: 'app-request-new-document',
  templateUrl: './request-new-document.component.html',
  styleUrls: ['./request-new-document.component.scss']
})
export class RequestNewDocumentComponent extends AbstractWizardComponent implements OnInit {

  isEligible: boolean = true
  isDocReqSucceeded: boolean = false
  docTypes: any = null

  accounts: any[] = []
  selectedAccount
  formModel: FormGroup
  selectedDocType: any = {
    key: null,
    value: null
  }

  bsConfig: any
  today = new Date()
  yesterday = new Date()
  oneYearAgo = new Date()

  constructor(
      public fb: FormBuilder,
      public translate: TranslateService,
      public router: Router,
      public service: RequestNewDocumentService
  ) {
    super(fb, translate, router);
    this.service.getCustDocsModels().subscribe(result => {
      this.docTypes = result
    })

    this.yesterday.setDate(this.today.getDate() - 1)
    this.oneYearAgo.setDate(this.today.getDate() - 359)

    this.translate.onLangChange.subscribe(result => {
      this.service.getCustDocsModels().subscribe(result => {
        this.docTypes = result
      })
    })
  }

  ngOnInit(): void {
    this.wizardStep = 1

    this.bsConfig = Object.assign(
        {},
        {
          showWeekNumbers: false,
          adaptivePosition: true,
          containerClass: 'theme-dark-blue',
          dateInputFormat: 'DD/MM/YYYY',
        },
    )

  }

  canGoBack(){
    return this.wizardStep > 1
  }

  back() {
    this.markPreviousWizardStep()
  }

  cancel(){
    this.router.navigateByUrl('/')
  }

  getWizardStepsCount() {
  }

  isDisabled() {

  }

  next() {
    switch (this.wizardStep) {
      case 3:
        this.service.createCustDocRequest(this.formModel).subscribe(result => {
          if(result.errorCode == '0'){
            this.isDocReqSucceeded = true
          }
          this.markNextWizardStep()
        })
        break
      default:
        this.markNextWizardStep()
    }
  }

  canGoNext(){
    switch (this.wizardStep){
      case 1:
        return this.selectedDocType.key != null && this.isEligible
      case 2:
        return this.formModel.valid
      case 3:
        return true
      default:
        this.wizardStep >= 1 && this.wizardStep < 4 && this.isEligible && this.formModel.valid
        break
    }
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  inquireEligibilityAndBuildForm(docType){
    if(!docType){
      this.isEligible = false
    } else {
      this.service.custDocEligibility(docType.key).subscribe(result => {
        this.isEligible = result.custDocEligible

        if(result.errorCode == '0' && this.isEligible){
          this.selectedDocType = docType
          this.buildFormModel(docType.key)
          this.initiateAccounts()
        }
      })
    }
  }

  buildFormModel(docType){
    switch (docType) {
      case this.service.BANK_CERTIFICATE_CODE:
        this.formModel = this.service.buildBankCertificateForm(docType)
        break
      case this.service.ACCOUNT_STATEMENT_CODE:
        this.formModel = this.service.buildAccountStatementForm(docType)
        break
      case this.service.IBAN_CERTIFICATE_CODE:
        this.formModel = this.service.buildIBANCertificateForm(docType)
        break
    }
  }

  initiateAccounts() {
    this.service.getSARAccounts().subscribe(result => {
      if(result.errorCode == '0'){
        this.accounts = result.listAlertsPermissionAccount
      }
    })
  }

  selectAccount(event){
    if(event?.fullAccountNumber){
      this.formModel.controls['acctNum'].patchValue(event.fullAccountNumber)
    } else {
      this.formModel.controls['acctNum'].setErrors({required: true})
    }
  }

  goToStatus(){
    this.router.navigateByUrl('/accounts/customerDocuments/viewDocumentsStatus')
  }

  finish() {
    super.finish();
    this.formModel.reset()
    this.selectedDocType = {
      key: null,
      value: null
    }
  }

  goBackToDashboard(){
    this.router.navigateByUrl('/')
  }

  balanceDateChange(date){
    if(date){
      const selectedDate = new Date(date)
      this.formModel.controls['balanceDate'].clearValidators()
      this.formModel.controls['balanceDate'].setValue(selectedDate)
    }
  }
}
