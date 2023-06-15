import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { SecuredAuthentication } from '../../../../Components/secured-authentication/secured-authentication.component'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { CompanyAdminUserManagementEditFormService } from '../../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'
import { StaticService } from '../../../Common/Services/static.service'
import { CompanyAdminUserManagementSelectedDataService } from '../list/company-admin-user-management-selected-data.service'
import { CompanyAdminUserManagementEditService } from './../edit/company-admin-user-management-edit.service'
import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { Step3Component } from './Steps/Step3/step3.component'

@Component({
  templateUrl: './company-admin-user-management-delete-user.component.html',
  styleUrls: ['./company-admin-user-management-delete-user.component.scss'],
})
export class CompanyAdminUserManagementDeleteUserComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(Step1Component)
  step1: Step1Component
  @ViewChild(Step2Component)
  step2: Step2Component
  @ViewChild(Step3Component)
  step3: Step3Component

  company: any = null

  public selectedUser: any = null

  public userData: any = null

  public combosData: any = {}

  public messageError: any = {}

  private dataToConfirm: any = {}

  private dataToValidate: any = {}

  private oldTokenSerial: any = null

  @ViewChild(SecuredAuthentication)
  authorization: SecuredAuthentication

  generateChallengeAndOTP: ResponseGenerateChallenge = null
  requestValidate: RequestValidate

  constructor(
    public fb: FormBuilder,
    public editService: CompanyAdminUserManagementEditService,
    public selectedUserDataService: CompanyAdminUserManagementSelectedDataService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public formService: CompanyAdminUserManagementEditFormService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.requestValidate = new RequestValidate()
    this.selectedUser = this.selectedUserDataService.getSelectedUser()

    this.userData = this.selectedUserDataService.getFormData()

    this.formModel = this.selectedUserDataService.getForm()

    this.combosData['tokens'] = []
  }

  ngOnInit() {
    super.ngOnInit()

    this.wizardStep = 1

    if (!this.selectedUser) {
      this.back()
    } else {
      this.wizardStep = 1
    }

    //-------------------------------------------

    this.generateTokensComboData()

    if (
      this.userData.companyUserDetails.tokenSerial &&
      this.userData.companyUserDetails.tokenSerial != null
    ) {
      this.oldTokenSerial = '' + this.userData.companyUserDetails.tokenSerial
    }
    ////console.log("this.oldTokenSerial", this.oldTokenSerial);
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
            .subscribe((result) => {
              if (result.hasOwnProperty('error')) {
                const res = <any>result
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
        this.messageError = {}
        this.subscriptions.push(
          this.editService
            .modifyUser(this.dataToConfirm)
            .subscribe((result) => {
              if (result && result.errorCode != '0') {
                //const res = <any>result;
                //this.messageError['code'] = res.errorCode;
                //this.messageError['description'] = res.errorDescription;
              } else {
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
    switch (this.wizardStep) {
      case 1:
        enabled = this.formModel.valid
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
    //this.formModel.reset();
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
    dataToValidate['typeOperation'] = 'DL'
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

  getPrivileges(form): any {
    const privileges = []

    for (let g = 0; g < this.userData.realGroup.length; g++) {
      const groupControls = this.userData.realGroup[g]
      for (let i = 0; groupControls.controls.length > i; i++) {
        if (groupControls.controls[i].control.value == true) {
          privileges.push(groupControls.controls[i].groupData)
        }
      }
    }

    return privileges
  }

  setDaysOfWeeks(form) {
    const daysOfWeek = []
    if (this.formModel.controls['saturday'].value) {
      daysOfWeek.push({ dayValue: 0 })
    }
    if (this.formModel.controls['sunday'].value) {
      daysOfWeek.push({ dayValue: 1 })
    }
    if (this.formModel.controls['monday'].value) {
      daysOfWeek.push({ dayValue: 2 })
    }
    if (this.formModel.controls['tuesday'].value) {
      daysOfWeek.push({ dayValue: 3 })
    }
    if (this.formModel.controls['wednesday'].value) {
      daysOfWeek.push({ dayValue: 4 })
    }
    if (this.formModel.controls['thursday'].value) {
      daysOfWeek.push({ dayValue: 5 })
    }
    if (this.formModel.controls['friday'].value) {
      daysOfWeek.push({ dayValue: 6 })
    }
    return daysOfWeek
  }

  modifyAccountList(data, form: FormGroup) {
    const accountControl = <FormArray>form.controls['accountList']
    accountControl.controls.forEach((group: FormGroup) => {
      const value = group.controls['account'].value
      this.updateValueAccount(data, group)
    })
  }

  setBackEndAccountPrivilegesData(privileges: any, form: FormGroup) {
    const backEndAccountPrivilegesControls = <FormArray>(
      form.controls['backEndAccountPrivileges']
    )

    backEndAccountPrivilegesControls.controls.forEach((group: FormGroup) => {
      const privilegeKey = group.controls['privilege'].value

      const privilegesConfigData = privileges[privilegeKey]

      privilegesConfigData[0] = group.controls['l1'].value
      privilegesConfigData[1] = group.controls['l2'].value
      privilegesConfigData[2] = group.controls['l3'].value
      privilegesConfigData[3] = group.controls['l4'].value
      privilegesConfigData[4] = group.controls['l5'].value
    })
  }

  updateValueAccount(data, group) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      if (data[i].fullAccountNumber == group.controls['account'].value) {
        data[i].inquiry = group.controls['inquiry'].value
        data[i].accountLevels[0] = group.controls['l1'].value
        data[i].accountLevels[1] = group.controls['l2'].value
        data[i].accountLevels[2] = group.controls['l3'].value
        data[i].accountLevels[3] = group.controls['l4'].value
        data[i].accountLevels[4] = group.controls['l5'].value
        break
      }
    }
  }
}
