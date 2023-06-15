import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { SecuredAuthentication } from '../../../../Components/secured-authentication/secured-authentication.component'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { CompanyAdminUserManagementEditFormService } from '../../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'
import { StaticService } from '../../../Common/Services/static.service'

import { CompanyAdminUserManagementAddService } from './company-admin-user-management-add.service'
import { CompanyAdminUserManagementAddStep1Component } from './Steps/Step1/company-admin-user-management-add-step1.component'
import { CompanyAdminUserManagementAddStep2Component } from './Steps/Step2/company-admin-user-management-add-step2.component'
import { CompanyAdminUserManagementAddStep3Component } from './Steps/Step3/company-admin-user-management-add-step3.component'
import { CompanyAdminUserManagementAddStep4Component } from './Steps/Step4/company-admin-user-management-add-step4.component'
import { Exception } from 'app/Application/Model/exception'
import { eTradePrivilege } from 'app/Application/Model/eTradePrivilege/eTradePrivilege'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
  templateUrl: './company-admin-user-management-add.component.html',
  styleUrls: ['./company-admin-user-management-add.component.scss'],
})
export class CompanyAdminUserManagementAddComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CompanyAdminUserManagementAddStep1Component)
  step1: CompanyAdminUserManagementAddStep1Component
  @ViewChild(CompanyAdminUserManagementAddStep2Component)
  step2: CompanyAdminUserManagementAddStep2Component
  @ViewChild(CompanyAdminUserManagementAddStep3Component)
  step3: CompanyAdminUserManagementAddStep3Component
  @ViewChild(CompanyAdminUserManagementAddStep4Component)
  step4: CompanyAdminUserManagementAddStep4Component

  company: any = null

  formModel: FormGroup
  userData: any = {}
  formAction = 'add'

  messageError: any = {}

  combosData: any = {}

  dataToValidate: any = {}

  dataToConfirm: any = {}

  @ViewChild(SecuredAuthentication)
  authorization: SecuredAuthentication

  generateChallengeAndOTP: ResponseGenerateChallenge = null
  requestValidate: RequestValidate

  companyAuthenticationMethod = ''

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public addService: CompanyAdminUserManagementAddService,
    public formService: CompanyAdminUserManagementEditFormService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authentication: AuthenticationService,
    private storageService: StorageService,
  ) {
    super(fb, translate, router)
    this.requestValidate = new RequestValidate()
    this.combosData['tokens'] = []
  }

  ngOnInit() {
    super.ngOnInit()

    this.wizardStep = 1
    this.company = this.storageService.retrieve('company');

    this.messageError = {}

    this.subscriptions.push(
      this.addService.preInsertUser().subscribe((result: any) => {
        if (
          result.hasOwnProperty('error') &&
          result.error instanceof Exception
        ) {
          const res = result
          this.messageError['code'] = res.error.errorCode
          this.messageError['description'] = res.error.errorDescription

          return
        } else {
          this.messageError = {}
          //console.log("result", result);
          this.userData = result
          this.generateTokensComboData()
          this.userData.companyUserDetails = this.userData.companyUserDetails
            ? this.userData.companyUserDetails
            : {}
          this.formService.getCompanyEtradePrivilege(this.company.profileNumber).subscribe((response: eTradePrivilege) => {
            const eTradePrivileges = response.companyEtradeFunctionList
            this.userData.eTradePrivileges = eTradePrivileges

            this.formModel = this.formService.createUserForm(
              this.userData,
              false,
              false,
            )

          })          //console.log("formModel", this.formModel);
        }
      }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getWizardStepsCount() {
    this.wizardStepsCount = 4
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
      case 4:
        this.step4 = events
        break
    }
  }

  isPreviousAllowed(): boolean {
    return super.isPreviousAllowed() // && this.authenticationService.activateOption('', [], ['']);
  }

  isNextAllowed(): boolean {
    return super.isNextAllowed() // && this.authenticationService.activateOption('', [], ['']);
  }

  isFinishAllowed(): boolean {
    return super.isFinishAllowed() // && this.authenticationService.activateOption('', [], ['']);
  }

  previous() {
    this.wizardStep--
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.messageError = {}
        this.markNextWizardStep()
        break
      case 2:
        this.dataToValidate = {}
        this.prepareDataToValidate(
          this.dataToValidate,
          this.formModel,
          this.userData,
          null,
          this.company,
        )
        this.subscriptions.push(
          this.addService
            .validateAddUser(this.dataToValidate)
            .subscribe((response: any) => {
              if (
                response.hasOwnProperty('error') &&
                response.error instanceof Exception
              ) {
                const res = response

                this.messageError['code'] = res.error.errorCode
                this.messageError['description'] = res.error.errorDescription
              } else {
                this.dataToConfirm = response
                this.messageError = {}
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 3:
        this.dataToConfirm.user.qtlLimit = this.formModel.controls['qtlLimit']
          ? this.formModel.controls['qtlLimit'].value
          : null
        const confirmData = { user: this.dataToConfirm.user }
        this.messageError = {}
        this.subscriptions.push(
          this.addService
            .confirmAddUser(confirmData)
            .subscribe((response: any) => {
              //console.log(response)
              if (
                response.errorCode != '0' ||
                response.hasOwnProperty('error') ||
                response.error instanceof Exception
              ) {
                const res = response
                this.messageError['code'] = res.error.errorCode
                this.messageError['description'] = res.error.errorDescription
              } else {
                this.messageError = {}
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
        enabled = this.formModel && this.formModel.valid
        break
      case 3:
        enabled = this.valid()
        if (this.wizardStep === 3) {
          if (this.generateChallengeAndOTP === null) {
            enabled = true
          } else {
            enabled = this.authorization ? this.authorization.valid() : true
          }
        }
        break
      default:
        break
    }
    return !enabled
  }

  back() {
    this.router.navigate(['/companyadmin/manage/user'])
  }

  finish() {
    this.router.navigate(['/companyadmin/manage/user'])
  }

  //-----------------------------------------------------

  generateTokensComboData() {
    this.combosData['tokens'] = []

    const tok = this.userData.unassignedSoftSerialList
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tok.length; i++) {
      this.combosData['tokens'].push(tok[i])
    }

    const tok2 = this.userData.unassignedHardSerialList
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tok2.length; i++) {
      this.combosData['tokens'].push(tok2[i])
    }
  }

  prepareDataToValidate(
    dataToValidate,
    formModel: FormGroup,
    userData,
    userPk,
    company = null,
  ) {
    dataToValidate['companyUser'] = {}
    dataToValidate['typeOperation'] = 'RG'
    dataToValidate['profileNumber'] = company ? company.profileNumber : null
    this.formService.setFormModelToData(
      dataToValidate,
      formModel,
      userData,
      null,
    )
  }

  prepareDataToConfirm(data, form, userPk) {
    // TODO do nothing
    //this.dataToConfirm;
  }
}
