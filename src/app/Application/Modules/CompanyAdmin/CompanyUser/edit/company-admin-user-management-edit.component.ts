import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SecuredAuthentication } from 'app/Application/Components/secured-authentication/secured-authentication.component'
import { Exception } from 'app/Application/Model/exception'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { AbstractWizardComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-wizard.component'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { CompanyAdminUserManagementEditFormService } from '../../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'
import { StaticService } from '../../../Common/Services/static.service'
import { CompanyAdminUserManagementSelectedDataService } from '../list/company-admin-user-management-selected-data.service'
import { CompanyAdminUserManagementEditService } from './company-admin-user-management-edit.service'
import { CompanyAdminUserManagementEditStep1Component } from './Steps/Step1/company-admin-user-management-edit-step1.component'
import { CompanyAdminUserManagementEditStep2Component } from './Steps/Step2/company-admin-user-management-edit-step2.component'
import { CompanyAdminUserManagementEditStep3Component } from './Steps/Step3/company-admin-user-management-edit-step3.component'
import { TransferLocalService } from 'app/Application/Modules/Transfers/Services/transfer-local.service'
import { SessionStorageService } from 'ngx-webstorage'

@Component({
  templateUrl: './company-admin-user-management-edit.component.html',
  styleUrls: ['./company-admin-user-management-edit.component.scss'],
})
export class CompanyAdminUserManagementEditComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(CompanyAdminUserManagementEditStep1Component)
  step1: CompanyAdminUserManagementEditStep1Component
  @ViewChild(CompanyAdminUserManagementEditStep2Component)
  step2: CompanyAdminUserManagementEditStep2Component
  @ViewChild(CompanyAdminUserManagementEditStep3Component)
  step3: CompanyAdminUserManagementEditStep3Component

  company: any = null

  selectedUser: any = null

  userData: any = null

  combosData: any = {}

  messageError: any = {}

  dataToConfirm: any = {}

  dataToValidate: any = {}

  @ViewChild(SecuredAuthentication)
  authorization: SecuredAuthentication

  generateChallengeAndOTP: ResponseGenerateChallenge = null
  requestValidate: RequestValidate

  companyAuthenticationMethod = ''

  constructor(
    public fb: FormBuilder,
    public editService: CompanyAdminUserManagementEditService,
    public selectedUserDataService: CompanyAdminUserManagementSelectedDataService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public formService: CompanyAdminUserManagementEditFormService,
    public router: Router,
    private sessionStorage: SessionStorageService,
  ) {
    super(fb, translate, router)
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    super.ngOnInit()

    this.companyAuthenticationMethod =
      this.formService.getCompanyAuthenticationMethod(null)

    this.wizardStep = 1

    this.selectedUser = this.selectedUserDataService.getSelectedUser()

    if (!this.selectedUser) {
      this.back()
    } else {
      this.wizardStep = 1
    }

    this.userData = this.selectedUserDataService.getFormData()

    this.formModel = this.selectedUserDataService.getForm()

    //-------------------------------------------

    this.generateTokensComboData()

    if (this.formModel.controls['userAuthenticationType']) {
      if (!this.allowOTPMethod()) {
        if (
          this.formModel.controls['userAuthenticationType'].value == 'OTP' ||
          this.formModel.controls['userAuthenticationType'].value == 'STATIC'
        ) {
          this.formModel.controls['userAuthenticationType'].setValue('')
        }
      } else if (!this.allowCHALLENGEMethod()) {
        if (
          this.formModel.controls['userAuthenticationType'].value ==
            'CHALLENGE' ||
          this.formModel.controls['userAuthenticationType'].value == 'STATIC'
        ) {
        }
      }
    }

    if (
      this.userData.companyUserDetails.tokenSerial &&
      this.userData.companyUserDetails.tokenSerial != null
    ) {
      this.userData.oldTokenSerial =
        '' + this.userData.companyUserDetails.tokenSerial
    }

    this.formModel.markAllAsTouched()
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
        // Validate form data
        this.dataToValidate = {}
        this.prepareDataToValidate(
          this.dataToValidate,
          this.formModel,
          this.userData,
          this.selectedUser.userPk,
          this.company,
        )
        this.messageError = {}
        this.subscriptions.push(
          this.editService
            .validateModifyUser(this.dataToValidate)
            .subscribe((result: any) => {
              if (result instanceof Exception) {
                const res = result as any
                this.messageError['code'] = res.error.errorCode
                this.messageError['description'] = res.error.errorDescription
              } else {
                // TODO
                this.generateChallengeAndOTP = result['generateChallengeAndOTP']
                this.dataToConfirm = {
                  generateChallengeAndOTP: result.generateChallengeAndOTP,
                  requestValidate: {
                    challengeNumber: null,
                    challengeResponse: null,
                    otp: null,
                    password: null,
                  },
                  user: result.user,
                }
                this.messageError = {}
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 2:
        // Submit validated data
        this.prepareDataToConfirm(
          this.userData,
          this.formModel,
          this.selectedUser.userPk,
        )
        this.dataToConfirm['requestValidate'] = this.requestValidate
        this.dataToConfirm.user.qtlLimit = this.formModel.controls['qtlLimit']
          ? this.formModel.controls['qtlLimit'].value
          : null
        this.messageError = {}
        this.subscriptions.push(
          this.editService
            .modifyUser(this.dataToConfirm)
            .subscribe((result: any) => {
              if (result instanceof Exception) {
                const res = result as any
                this.messageError['code'] = res.error.errorCode
                this.messageError['description'] = res.error.errorDescription
              } else {
                this.sessionStorage.store(
                  'user.conpanyQtlLimit',
                  this.dataToConfirm.user.qtlLimit,
                )
                this.sessionStorage.store(
                  'user.qtlLimit',
                  this.dataToConfirm.user.qtlLimit,
                )
                this.messageError = {}
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
    if (this.formModel.controls['qtlLimit'].status == 'INVALID') {
      return enabled
    }
    switch (this.wizardStep) {
      case 1:
        enabled = this.formModel && this.formModel.valid
        break
      case 2:
        enabled = this.valid()
        if (this.wizardStep === 2) {
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
    this.router.navigate(['/companyadmin/user/details'])
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

    this.combosData['tokens'].push(this.userData.companyUserDetails.tokenSerial)
  }

  prepareDataToValidate(
    dataToValidate,
    formModel: FormGroup,
    userData,
    userPk,
    company = null,
  ) {
    dataToValidate['typeOperation'] = 'MD'
    dataToValidate['profileNumber'] = company ? company.profileNumber : null

    this.formService.setFormModelToData(
      dataToValidate,
      formModel,
      userData,
      userPk,
    )
  }

  prepareDataToConfirm(data, form, userPk) {
    // TODO do nothing
    //this.dataToConfirm;
  }

  allowOTPMethod() {
    return (
      this.companyAuthenticationMethod == 'STATIC' ||
      this.companyAuthenticationMethod == 'OTP' ||
      this.companyAuthenticationMethod == 'BOTH'
    )
  }

  allowCHALLENGEMethod() {
    return (
      this.companyAuthenticationMethod == 'CHALLENGE' ||
      this.companyAuthenticationMethod == 'SOFT' ||
      this.companyAuthenticationMethod == 'BOTH'
    )
  }
}
