import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { interval } from 'rxjs'
import { StaticService } from '../../../../Services/static.service'
import { AbstractAppComponent } from '../../../Abstract/abstract-app.component'
import { CompanyAdminUserManagementEditFormService } from './company-admin-user-management-edit-form.service'
import { Exception } from '../../../../../../Model/exception'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { TransferLocalService } from '../../../../../Transfers/Services/transfer-local.service'
import {StorageService} from "../../../../../../../core/storage/storage.service";

@UntilDestroy()
@Component({
  selector: 'company-admin-user-management-edit-form',
  styleUrls: ['./company-admin-user-management-edit-form.component.scss'],
  templateUrl: './company-admin-user-management-edit-form.component.html',
})
export class CompanyAdminUserManagementEditFormComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() userData: any = {}

  @Input() formModel: FormGroup

  @Input() formAction = ''

  @Input() allowChangeUserId = false

  @Input() allowEditToken = false

  @Input() showUserStatus = true
  @Input() allowChangeUserStatus = false

  @Input() showUserType = true
  @Input() allowChangeUserType = false

  @Input() enabled = true

  @Input() combosData: any = {}

  @Input() messageError: any = {}

  @Input() showUserDetailPanel = true

  @Input() showPrivilegesPanel = true

  @Input() company: any = null
  @Input() restrictAuthenticationMethod = true

  @Input() isBAM = false

  companyQTL: any
  companyMaxQTL: any
  emptyCompanyLimit = false
  updatingAdminLimit = false
  companyLimitError = false
  maxLimitBreach = false
  localLimitBreached = false
  dailyLimitBreached = false
  localLimit = 0
  dailyLimit = 0
  isActionUnlock = false

  combosKeys = [
    'languages',
    'userType',
    'userStatus',
    'nationalityCode',
    'companyUserGroups',
  ]

  // Private properties for binding

  checkboxAccInquires = false

  checkboxL1Acc = false
  checkboxL2Acc = false
  checkboxL3Acc = false
  checkboxL4Acc = false
  checkboxL5Acc = false

  checkboxL1Priv = false
  checkboxL2Priv = false
  checkboxL3Priv = false
  checkboxL4Priv = false
  checkboxL5Priv = false

  checkboxL1eTradeInit = false
  checkboxL1eTrade = false
  checkboxL2eTrade = false
  checkboxL3eTrade = false
  checkboxL4eTrade = false
  checkboxL5eTrade = false

  bsConfig = Object.assign(
    {},
    {
      showWeekNumbers: false,
      adaptivePosition: true,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD/MM/YYYY',
    },
  )

  @ViewChild('confirmationPopUp', { static: true })
  public confirmationPopUp: ModalDirective
  confirmationPopUpData: any = {}
  //----------------------------------------------------

  _groupsMarkAllSubItemsAsChecked: any[] = []

  companyAuthenticationMethod = ''

  dependentFieldByGroup: any = {
    //limit: "limit",
    billPaymentLimit: {
      group: 'BillPayGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },
    sadadInvoiceHubLimit: {
      group: 'SadadInvoiceHubGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },
    governmentPaymentLimit: {
      group: 'EgovGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },
    ownacclimit: {
      group: 'TfOwnGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },

    withinlimit: {
      group: 'TfGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9),
        this.formService.companyDailyLimitValidator(this.storageService.retrieve('company').companyLimits)],
    },
    locallimit: {
      group: 'TfLocalGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9),
        this.formService.companyDailyLimitValidator(this.storageService.retrieve('company').companyLimits)],
    },
    qtlLimit: {
      group: 'TfLocalGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },
    internationallimit: {
      group: 'TfRemGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9),
        this.formService.companyDailyLimitValidator(this.storageService.retrieve('company').companyLimits)],
    },

    bulkLimit: {
      group: 'BulkPaymentsGroup',
      defaultValue: 0,
      validators: [Validators.required, Validators.maxLength(9)],
    },

    vaPermissions: {
      group: 'VirtualAccountsGroup',
      defaultValue: null,
      validators: [
        //Validators.required
      ],
    },
  }
  groupListEmcrey = false;
  selectedMerchantPortalObject: any = {};
   showDropDownList = false;
  constructor(
    public translate: TranslateService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public formService: CompanyAdminUserManagementEditFormService,
    public staticService: StaticService,
    public serviceTransfer: TransferLocalService,
    public authenticationService: AuthenticationService,
    private storageService: StorageService,
  ) {
    super(translate)
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.combosKeys.length; i++) {
      this.combosData[this.combosKeys[i]] = this.combosData[this.combosKeys[i]]
        ? this.combosData[this.combosKeys[i]]
        : []
    }
  }

  ngOnInit() {
    this.companyLimit = this.storageService.retrieve('company').companyLimits

    super.ngOnInit()
    interval(1000).pipe(untilDestroyed(this)).subscribe()

    //-----------------------------

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )

    //-----------------------------

    this.refreshData()
    this.getCompanyLimit()

    //TODO discuss with GT about below
    if (this.enabled && this.showPrivilegesPanel) {
      this.refreshVaPermissions(false)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshData();
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  refreshData() {
    if (!this.formModel || !this.userData) {
      return null
    }
    if (this.restrictAuthenticationMethod) {
      this.companyAuthenticationMethod =
        this.formService.getCompanyAuthenticationMethod(this.company)
    } else {
      this.companyAuthenticationMethod = 'BOTH'
    }
    //-----------------------------

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          const companyUserGroupsValues = data['companyUserGroups']
          this.combosData['companyUserGroups'] = []
          companyUserGroupsValues.forEach((item, i) => {
            this.combosData['companyUserGroups'][item['key']] = item['value']
          })
        }),
    )

    this.generateHoursInterval()

    //-----------------------------

    this.subscriptions.push(
      this.formModel.controls['userAuthenticationType'].valueChanges.subscribe(
        (values) => {
          this.formChangeLoginType(values);
          this.changeLoginType(
              this.formModel.controls['userAuthenticationType'].value,
          );
        },
      ),
    )

    this.subscriptions.push(
      this.formModel.controls['accessLimited'].valueChanges.subscribe(
        (values) => {
          this.formChangeAccessTime();
        },
      ),
    )

    this.subscriptions.push(
      this.formModel.controls['accessLimited'].valueChanges.subscribe(
        (values) => {
          this.changeAccesTime()
        },
      ),
    )

    // ------------

    this.formChangeLoginType(
      this.formNormalizeAuthenticationType(
        this.formModel.controls['userAuthenticationType'].value,
      ),
    )

    if (
      this.userData &&
      this.userData['companyUserDetails'] &&
      this.userData['companyUserDetails']['vaPermissions'] &&
      this.userData['companyUserDetails']['vaPermissions'].length > 0
    ) {
      const vaPermissions = Array.isArray(this.combosData['vaPermissions'])
        ? this.combosData['vaPermissions']
        : []
      const vaPermissionKey =
        this.userData['companyUserDetails']['vaPermissions'][0].permissionId
      let vaPermissionValue =
        this.userData['companyUserDetails']['vaPermissions'][0].permissionDesc
      vaPermissions.forEach((p) => {
        if (p.key == vaPermissionKey) {
          vaPermissionValue = p.value
        }
      })
      this.combosData['vaPermissions'] = [
        {
          key: vaPermissionKey,
          value: vaPermissionValue,
        },
      ]
    } else {
      this.combosData['vaPermissions'] = this.combosData['vaPermissions']
        ? this.combosData['vaPermissions']
        : []
    }

    //this.checkAllAccountsChecked();

    //this.checkAllPrivilegesChecked();

    this.checkGroupsAllSubItemsChecked()

    //this.markVaPermissionsBlankIfNotAllowed();

    this.enableOrDisableControls(this.formModel)

    this.scrollToTop()

    if (this.userData.companyUserDetails.userImage && this.userData.companyUserDetails.userImage.type) {
      this.formModel.patchValue({
        userImage: this.userData.companyUserDetails.userImage.type + ',' + this.userData.companyUserDetails.userImage.content,
      })
      this.formModel.patchValue({
        userImageUrl: this.userData.companyUserDetails.userImage.type + ',' + this.userData.companyUserDetails.userImage.content,
      })
    }
    this.userData.realGroup.forEach((privillage) => {
      if (privillage.key === 'groupListEmCrey') {
        privillage.controls.forEach(
            (group) => {
              if (group.control.value === true) {
                this.selectedMerchantPortalObject = group;
                this.showDropDownList = true;
                this._groupsMarkAllSubItemsAsChecked[privillage.key]=true;
              }
            }
        )
      }
    })
  }

  generateHoursInterval() {
    this.combosData['hours'] = []
    for (let i = 0; i < 24; i++) {
      this.combosData['hours'].push({
        key: this.pad(i, 2) + ':00:00',
        value: this.pad(i, 2) + ':00',
      })
      /*this.combosData["hours"].push({
                            key: this.pad(i, 2) + ":15:00",
                            value: this.pad(i, 2) + ":15"
                        });
                        this.combosData["hours"].push({
                            key: this.pad(i, 2) + ":30:00",
                            value: this.pad(i, 2) + ":30"
                        });
                        this.combosData["hours"].push({
                            key: this.pad(i, 2) + ":45:00",
                            value: this.pad(i, 2) + ":45"
                        });*/
    }
    this.combosData['hours'].push({
      key: '23:59:00',
      value: '23:59',
    })
  }

  pad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) {
      s = '0' + s
    }
    return s
  }

  changeLoginType(loginType) {
    this.disabledPasswordControls()
    if (loginType === 'CHALLENGE') {
      this.setTokenValidators()
      this.formModel.controls['tokenLanguage'].enable()
      this.formModel.controls['passwordDelivery'].enable()
    } else {
      this.clearTokenValidators()
      this.formModel.controls['tokenLanguage'].disable()
      this.formModel.controls['passwordDelivery'].disable()
    }
  }

  changeAccesTime() {
    if (this.formModel.controls['accessLimited'].value === 'true') {
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].setValidators(Validators.required)
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].setValidators(Validators.required)
    } else {
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].reset()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].clearValidators()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].reset()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].clearValidators()
    }
    ;(this.formModel.controls['accessHour'] as FormGroup).controls[
      'accessTo'
      ].updateValueAndValidity()
    ;(this.formModel.controls['accessHour'] as FormGroup).controls[
      'accessFrom'
      ].updateValueAndValidity()
  }

  setTokenValidators() {
    this.formModel.controls['passwordDelivery'].setValidators(
      Validators.required,
    )
    this.formModel.controls['tokenLanguage'].setValidators(Validators.required)
    this.formModel.controls['tokenLanguage'].updateValueAndValidity()
    this.formModel.controls['passwordDelivery'].updateValueAndValidity()
  }

  clearTokenValidators() {
    this.formModel.controls['tokenSerial'].clearValidators()
    this.formModel.controls['tokenSerial'].reset()
    this.formModel.controls['tokenLanguage'].clearValidators()
    this.formModel.controls['tokenLanguage'].reset()
    this.formModel.controls['passwordDelivery'].clearValidators()
    this.formModel.controls['passwordDelivery'].reset()
    this.formModel.controls['tokenLanguage'].updateValueAndValidity()
    this.formModel.controls['passwordDelivery'].updateValueAndValidity()
  }

  disabledPasswordControls() {
    this.formModel.controls['tokenLanguage'].disable()
    this.formModel.controls['passwordDelivery'].disable()
  }

  formChangeLoginType(values) {
    if (values === 'Static' || values === 'STATIC') {
      this.formClearTokenValidators()
    } else if (
      values === 'SoftToken' ||
      values === 'Soft' ||
      values === 'SOFT' ||
      values === 'CHALLENGE'
    ) {
    } else {
      this.formClearTokenValidators()
    }
  }

  formNormalizeAuthenticationType(type) {
    if (type === 'STATIC') {
      this.formModel.controls['userAuthenticationType'].setValue('OTP')
    }
    if (type === 'SOFT' || type === 'CHALLENGE') {
      this.formModel.controls['userAuthenticationType'].setValue('CHALLENGE')
    }
    return this.formModel.controls['userAuthenticationType'].value
  }

  formSetTokenValidators() {
    this.formModel.controls['tokenSerial'].setValidators(Validators.required)
    this.formModel.controls['passwordDelivery'].setValidators(
      Validators.required,
    )
    this.formModel.controls['tokenLanguage'].setValidators(Validators.required)
    this.formModel.controls['tokenSerial'].updateValueAndValidity()
    this.formModel.controls['tokenLanguage'].updateValueAndValidity()
    this.formModel.controls['passwordDelivery'].updateValueAndValidity()
  }

  formChangeAccessTime() {
    if (this.formModel.controls['accessLimited'].value === 'true') {
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].setValidators(Validators.required)
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].setValidators(Validators.required)
    } else {
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].reset()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessFrom'
        ].clearValidators()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].reset()
      ;(this.formModel.controls['accessHour'] as FormGroup).controls[
        'accessTo'
        ].clearValidators()
      this.formModel.controls['friday'].reset()
      this.formModel.controls['friday'].clearValidators()
    }
    ;(this.formModel.controls['accessHour'] as FormGroup).controls[
      'accessTo'
      ].updateValueAndValidity()
    ;(this.formModel.controls['accessHour'] as FormGroup).controls[
      'accessFrom'
      ].updateValueAndValidity()
    this.formModel.controls['friday'].updateValueAndValidity()
  }

  //--------------------------------------------

  formClearTokenValidators() {
    this.formModel.controls['tokenSerial'].clearValidators()
    this.formModel.controls['tokenSerial'].reset()
    this.formModel.controls['tokenLanguage'].clearValidators()
    this.formModel.controls['tokenLanguage'].reset()
    this.formModel.controls['passwordDelivery'].clearValidators()
    this.formModel.controls['passwordDelivery'].reset()
    this.formModel.controls['tokenSerial'].updateValueAndValidity()
    this.formModel.controls['tokenLanguage'].updateValueAndValidity()
    this.formModel.controls['passwordDelivery'].updateValueAndValidity()
  }

  showToken() {
    return (
      this.formModel.controls['userAuthenticationType'].value === 'SoftToken' ||
      this.formModel.controls['userAuthenticationType'].value === 'Soft' ||
      this.formModel.controls['userAuthenticationType'].value === 'SOFT' ||
      this.formModel.controls['userAuthenticationType'].value === 'CHALLENGE'
    )
  }

  public refreshVaPermissions(patchValue = true): void {
    if (!this.formModel.controls['vaPermissions']) {
      return
    }
    if (patchValue) {
      this.formModel.controls['vaPermissions'].patchValue(null)
    }
    this.formService.getVaPermissions(this.company).subscribe((res) => {
      if (res.errorCode != '0') {
      } else {
        const vaPermissions = []
        res.vaPermissions.forEach((vaPermission) => {
          if (vaPermission['value'] != '-- Select one --') {
            vaPermissions.push(vaPermission)
          }
        })
        this.combosData['vaPermissions'] = vaPermissions
      }
    })
  }

  //--------------------------------------------------------
  companyLimitBreach: boolean;
  companyLimit = 0;

  showAccesDays() {
    return this.formModel.controls['accessLimited'].value === 'true'
  }

  checkAllDays() {
    const check = !this.isAllDaysChecked()
    this.formModel.controls['saturday'].setValue(check)
    this.formModel.controls['sunday'].setValue(check)
    this.formModel.controls['monday'].setValue(check)
    this.formModel.controls['tuesday'].setValue(check)
    this.formModel.controls['wednesday'].setValue(check)
    this.formModel.controls['thursday'].setValue(check)
    this.formModel.controls['friday'].setValue(check)
  }

  isAllDaysChecked() {
    return (
      this.formModel.controls['saturday'].value &&
      this.formModel.controls['sunday'].value &&
      this.formModel.controls['monday'].value &&
      this.formModel.controls['tuesday'].value &&
      this.formModel.controls['wednesday'].value &&
      this.formModel.controls['thursday'].value &&
      this.formModel.controls['friday'].value
    )
  }

  oneTouchDay() {
    return (
      this.formModel.controls['saturday'].dirty ||
      this.formModel.controls['sunday'].dirty ||
      this.formModel.controls['monday'].dirty ||
      this.formModel.controls['tuesday'].dirty ||
      this.formModel.controls['wednesday'].dirty ||
      this.formModel.controls['thursday'].dirty ||
      this.formModel.controls['friday'].dirty
    )
  }

  public onSelectPicture(event: any | null): void {
    if (event === null || event === undefined) {
      this.formModel.patchValue({
        userImageUrl: null,
      })
      this.formModel.patchValue({
        userImage: null,
      })
      return
    }
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e: any) => {
        this.formModel.patchValue({
          userImageUrl: e.target.result,
        })
        this.formModel.patchValue({
          userImage: reader.result,
        })
      }
    }
  }

  enableOrDisableControls(form: FormGroup) {
    this.checkDependentFieldsBySelectedGroups()
    if (form != null) {
      if (this.enabled) {
        form.enable()
      } else {
        form.disable()
      }
      if (this.formAction == 'edit' && this.enabled) {
        form.markAllAsTouched()
      }
    }
  }

  checkAllAccountsChecked() {
    this.checkAccInquires()

    this.checkL1Acc()

    this.checkL2Acc()

    this.checkL3Acc()

    this.checkL4Acc()

    this.checkL5Acc()
  }

  checkAllPrivilegesChecked() {
    this.checkL1Priv()

    this.checkL2Priv()

    this.checkL3Priv()

    this.checkL4Priv()

    this.checkL5Priv()
  }

  checkAllGroupsByParentGroup(parent_key: string) {
    debugger
    if (!this.userData) {
      return
    }
    if (!this.userData.realGroup) {
      return
    }
    // tslint:disable-next-line:prefer-for-of
    for (let g = 0; g < this.userData.realGroup.length; g++) {
      const groupControls = this.userData.realGroup[g]
      if (groupControls.key === parent_key) {
        this._groupsMarkAllSubItemsAsChecked[parent_key] =
            !this._groupsMarkAllSubItemsAsChecked[parent_key]
        if (parent_key !== 'groupListEmCrey') {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < groupControls.controls.length; i++) {
            if (groupControls.controls[i].editable !== false) {
              groupControls.controls[i].control.patchValue(
                  this._groupsMarkAllSubItemsAsChecked[parent_key]
              )
            }
          }
        } else {
          this.selectEmCrey(groupControls, parent_key);
        }
      }
    }
    this.checkDependentFieldsBySelectedGroups()
  }

  selectEmCrey(groupControls, parent_key) {
    this.showDropDownList = !this.showDropDownList
    for (let i = 0; i < groupControls.controls.length; i++) {
      if (this._groupsMarkAllSubItemsAsChecked[parent_key]) {
        if (groupControls.controls[i].groupId === "Read Only") {
          groupControls.controls[i].control.
          patchValue(this._groupsMarkAllSubItemsAsChecked[parent_key]);
          this.selectedMerchantPortalObject = groupControls.controls[i];
        }
      } else {
        groupControls.controls[i].control.patchValue(this._groupsMarkAllSubItemsAsChecked[parent_key])
      }
    }
  }

  onDropDownChange(group, privillageIndex) {
    const privillageControls = this.userData.realGroup[privillageIndex];
    for (let i = 0; i < privillageControls.controls.length; i++) {
      privillageControls.controls[i].control.patchValue(group.groupId
          === privillageControls.controls[i].groupId);
    }
  }

  checkGroupsAllSubItemsChecked() {
    if (!this.userData) {
      return
    }
    if (!this.userData.realGroup) {
      return
    }
    // tslint:disable-next-line:prefer-for-of
    for (let g = 0; g < this.userData.realGroup.length; g++) {
      const groupControls = this.userData.realGroup[g]
      let check = true
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < groupControls.controls.length; i++) {
          if (groupControls.controls[i].groupData?.adminDefault && this.userData.companyUserDetails.type =="CA") {
              groupControls.controls[i].editable = false
              groupControls.controls[i].control.value = true
          }
          if (groupControls.controls[i].editable !== false) {
              check = check && groupControls.controls[i].control.value
          }
      }
      this._groupsMarkAllSubItemsAsChecked[groupControls.key] = check
    }

    if (this.formModel.controls['TfLocalGroup'].value!=true){
      this.formModel.controls['URPayGroup'].disable()
      this.formModel.controls['URPayGroup'].setValue(false)
    }else {
      this.formModel.controls['URPayGroup'].enable()
    }

    this.checkDependentFieldsBySelectedGroups()
  }

  checkAccInquires() {
    this.checkboxAccInquires = !this.checkboxAccInquires
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].inquiry.patchValue(this.checkboxAccInquires)
    }
  }

  checkL1Acc() {
    this.checkboxL1Acc = !this.checkboxL1Acc
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].l1.patchValue(this.checkboxL1Acc)
    }
  }

  checkL2Acc() {
    this.checkboxL2Acc = !this.checkboxL2Acc
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].l2.patchValue(this.checkboxL2Acc)
    }
  }

  checkL3Acc() {
    this.checkboxL3Acc = !this.checkboxL3Acc
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].l3.patchValue(this.checkboxL3Acc)
    }
  }

  checkL4Acc() {
    this.checkboxL4Acc = !this.checkboxL4Acc
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].l4.patchValue(this.checkboxL4Acc)
    }
  }

  checkL5Acc() {
    this.checkboxL5Acc = !this.checkboxL5Acc
    for (const account of this.formModel.controls.accountList['controls']) {
      account['controls'].l5.patchValue(this.checkboxL5Acc)
    }
  }

  checkL1Priv() {
    this.checkboxL1Priv = !this.checkboxL1Priv

    for (const account of this.formModel.controls.backEndAccountPrivileges[
      'controls'
      ]) {
      account['controls'].l1.patchValue(this.checkboxL1Priv)
    }
  }

  checkL2Priv() {
    this.checkboxL2Priv = !this.checkboxL2Priv
    for (const account of this.formModel.controls.backEndAccountPrivileges[
      'controls'
      ]) {
      account['controls'].l2.patchValue(this.checkboxL2Priv)
    }
  }

  checkL3Priv() {
    this.checkboxL3Priv = !this.checkboxL3Priv
    for (const account of this.formModel.controls.backEndAccountPrivileges[
      'controls'
      ]) {
      account['controls'].l3.patchValue(this.checkboxL3Priv)
    }
  }

  checkL4Priv() {
    this.checkboxL4Priv = !this.checkboxL4Priv
    for (const account of this.formModel.controls.backEndAccountPrivileges[
      'controls'
      ]) {
      account['controls'].l4.patchValue(this.checkboxL4Priv)
    }
  }

  checkL5Priv() {
    this.checkboxL5Priv = !this.checkboxL5Priv
    for (const account of this.formModel.controls.backEndAccountPrivileges[
      'controls'
      ]) {
      account['controls'].l5.patchValue(this.checkboxL5Priv)
    }
  }

  checkEtradeInit() {
    this.checkboxL1eTradeInit = !this.checkboxL1eTradeInit
    for (const eTrade of this.formModel.controls.eTradePrivileges['controls']) {
      eTrade['controls'].initiator.patchValue(this.checkboxL1eTradeInit)
    }
  }

  checkL1eTradeAll() {
    this.checkboxL1eTrade = !this.checkboxL1eTrade

    for (const eTrade of this.formModel.controls.eTradePrivileges[
      'controls'
    ]) {
      eTrade['controls'].l1.patchValue(this.checkboxL1eTrade)
    }
  }

  checkL2eTradeAll() {
    if (this.checkboxL2eTrade) {
      this.checkboxL2eTrade = !this.checkboxL2eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l2.patchValue(this.checkboxL2eTrade)
        eTrade['controls'].l1.enable()
      }
    } else {
      this.checkboxL1eTrade = true
      this.checkboxL2eTrade = !this.checkboxL2eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l1.patchValue(this.checkboxL1eTrade)
        eTrade['controls'].l2.patchValue(this.checkboxL2eTrade)
        eTrade['controls'].l1.disable()
      }
    }
  }

  checkL3eTradeAll() {
    if (this.checkboxL3eTrade) {
      this.checkboxL3eTrade = !this.checkboxL3eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l3.patchValue(this.checkboxL3eTrade)
        eTrade['controls'].l2.enable()
      }
    } else {
      this.checkboxL1eTrade = true
      this.checkboxL2eTrade = true
      this.checkboxL3eTrade = !this.checkboxL3eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l1.patchValue(this.checkboxL1eTrade)
        eTrade['controls'].l2.patchValue(this.checkboxL2eTrade)
        eTrade['controls'].l3.patchValue(this.checkboxL3eTrade)
        eTrade['controls'].l1.disable()
        eTrade['controls'].l2.disable()
      }
    }
  }

  checkL4eTradeAll() {
    if (this.checkboxL4eTrade) {
      this.checkboxL4eTrade = !this.checkboxL4eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l4.patchValue(this.checkboxL4eTrade)
        eTrade['controls'].l3.enable()
      }
    } else {
      this.checkboxL1eTrade = true
      this.checkboxL2eTrade = true
      this.checkboxL3eTrade = true
      this.checkboxL4eTrade = !this.checkboxL4eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l1.patchValue(this.checkboxL1eTrade)
        eTrade['controls'].l2.patchValue(this.checkboxL2eTrade)
        eTrade['controls'].l3.patchValue(this.checkboxL3eTrade)
        eTrade['controls'].l4.patchValue(this.checkboxL4eTrade)
        eTrade['controls'].l1.disable()
        eTrade['controls'].l2.disable()
        eTrade['controls'].l3.disable()
      }
    }
  }

  checkL5eTradeAll() {
    if (this.checkboxL5eTrade) {
      this.checkboxL5eTrade = !this.checkboxL5eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l5.patchValue(this.checkboxL5eTrade)
        eTrade['controls'].l4.enable()
      }
    } else {
      this.checkboxL1eTrade = true
      this.checkboxL2eTrade = true
      this.checkboxL3eTrade = true
      this.checkboxL4eTrade = true
      this.checkboxL5eTrade = !this.checkboxL5eTrade
      for (const eTrade of this.formModel.controls.eTradePrivileges[
        'controls'
      ]) {
        eTrade['controls'].l1.patchValue(this.checkboxL1eTrade)
        eTrade['controls'].l2.patchValue(this.checkboxL2eTrade)
        eTrade['controls'].l3.patchValue(this.checkboxL3eTrade)
        eTrade['controls'].l4.patchValue(this.checkboxL4eTrade)
        eTrade['controls'].l5.patchValue(this.checkboxL5eTrade)
        eTrade['controls'].l1.disable()
        eTrade['controls'].l2.disable()
        eTrade['controls'].l3.disable()
        eTrade['controls'].l4.disable()
      }
    }
  }

  checkL2eTrade(index) {
    if (this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.value) {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.disable()
    } else {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.enable()
    }
  }

  checkL3eTrade(index) {
    if (this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.value) {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.disable()
    } else {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.enable()
    }
  }

  checkL4eTrade(index) {
    if (this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l4.value) {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.disable()
    } else {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.enable()
    }
  }

  checkL5eTrade(index) {
    if (this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l5.value) {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l4.patchValue(true)
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l1.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l2.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l3.disable()
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l4.disable()
    } else {
      this.formModel.controls.eTradePrivileges['controls'][index]['controls'].l4.enable()
    }
  }

  getMobileNumberFormatPattern() {
    return this.formService.mobileNumberFormatPattern
  }

  getMobileNumberTextPattern() {
    return this.formService.mobileNumberTextPattern
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

  getTodayDate() {
    return new Date()
  }

  isAllowedDependentFieldBySelectedGroup(fieldname = null): boolean {
    if (!fieldname) {
      return false
    }
    if (!this.dependentFieldByGroup[fieldname]) {
      return true
    }
    const fieldData = this.dependentFieldByGroup[fieldname]
    return (
      this.formModel &&
      this.formModel.controls[fieldname] &&
      fieldData &&
      this.formModel.controls[fieldData.group] &&
      this.formModel.controls[fieldData.group].value == true
    )
  }

  checkDependentFieldsBySelectedGroups() {
    const fieldsNames = Object.keys(this.dependentFieldByGroup)
    fieldsNames.forEach((fieldname) => {
      const fieldData = this.dependentFieldByGroup[fieldname]
      if (this.formModel.controls[fieldname]) {
        //this.formModel.controls[fieldname].enable();
        if (!this.isAllowedDependentFieldBySelectedGroup(fieldname)) {
          this.formModel.controls[fieldname].setValue(fieldData.defaultValue)
          //this.formModel.controls[fieldname].disable();
          this.formModel.controls[fieldname].clearValidators()
        } else {
          this.formModel.controls[fieldname].setValue(
            this.formModel.controls[fieldname].value !== null
              ? this.formModel.controls[fieldname].value
              : fieldData.defaultValue,
          )
          this.formModel.controls[fieldname].setValidators(fieldData.validators)
          //this.formModel.controls[fieldname].enable();
          this.formModel.controls[fieldname].markAsTouched()
        }
        this.formModel.controls[fieldname].updateValueAndValidity()
      }
    })
  }

  canEditToken() {
    return (
      this.showToken() &&
      this.enabled &&
      this.allowEditToken &&
      this.formModel.get('oldTokenSerial').value &&
      this.formModel.get('oldTokenSerial').value ==
      this.formModel.get('tokenSerial').value
    )
  }

  canExecuteTokenAction(action = '') {
    if (
      !(
        this.formModel.get('tokenSerial').value !== '' &&
        this.formModel.get('tokenSerial').value !== null &&
        this.formModel.get('tokenSerial').value !== undefined &&
        this.formModel.get('oldTokenSerial').value ==
        this.formModel.get('tokenSerial').value
      )
    ) {
      return false
    }
    switch (action) {
      case 'reset':
        return true
        break
      case 'resendActivation':
        return true
        break
      case 'nonOperative':
        return this.formModel.get('oldTokenStatus').value != 'NON_OPERATIVE'
        break
      case 'lost':
        return this.formModel.get('oldTokenStatus').value != 'LOST'
        break
      case 'unblock':
        return this.formModel.get('oldTokenStatus').value == 'BLOCKED'
      case 'block':
        return this.formModel.get('oldTokenStatus').value != 'BLOCKED'
        break
      case 'unlock':
        return true
      case 'remove':
        return true
        break
    }
    return true
  }

  canShowTokenStatus() {
    return (
      this.formModel.get('tokenSerial').value !== '' &&
      this.formModel.get('tokenSerial').value !== null &&
      this.formModel.get('tokenSerial').value !== undefined &&
      this.formModel.get('oldTokenSerial').value ==
      this.formModel.get('tokenSerial').value &&
      this.formModel.get('oldTokenStatus').value
    )
  }

  executeTokenAction(action, buttonMessage, sentNew = true, updateOld = false) {
    if (!this.canEditToken()) {
      return
    }
    this.confirmationPopUpData = {
      action,
      buttonMessage,
      sentNew,
      updateOld,
    }

    this.confirmationPopUp.show()
  }

  confirmTokenAction() {
    if (!this.canEditToken()) {
      return
    }

    this.confirmationPopUp.hide()

    const action = this.confirmationPopUpData.action
    const sentNew = this.confirmationPopUpData.sentNew
    const updateOld = this.confirmationPopUpData.updateOld

    this.confirmationPopUpData = {}

    const data = {
      challengeNumber: action === 'unlock' ? this.formModel.controls['unlockTokenChallengeNumber'].value : null,
      companyUserDSO: this.userData['companyUserDetails']
        ? this.userData['companyUserDetails']
        : this.userData,
      tokenModifyFlow: action,
    }
    this.subscriptions.push(
      this.formService.modifyUserToken(data).subscribe((response) => {
        if (response instanceof Exception) {
        } else {
          if (updateOld) {
            switch (action) {
              case 'reset':
                //this.formModel.get('oldTokenStatus').setValue('');
                break
              case 'resendActivation':
                //this.formModel.get('oldTokenStatus').setValue('');
                break
              case 'nonOperative':
                this.formModel.get('oldTokenStatus').setValue('NON_OPERATIVE')
                break
              case 'lost':
                this.formModel.get('oldTokenStatus').setValue('LOST')
                break
              case 'unblock':
                this.formModel.get('oldTokenStatus').setValue('ACTIVE')
                break
              case 'block':
                this.formModel.get('oldTokenStatus').setValue('BLOCKED')
                break
              case 'unlock':
                this.isActionUnlock = false
                this.formModel.controls['unlockTokenChallengeNumber'].patchValue(null)
                this.formModel.get('oldTokenStatus').setValue('ACTIVE')
                break
              case 'remove':
                this.formModel.get('tokenSerial').setValue(null)
                this.formModel.get('oldTokenSerial').setValue(null)
                this.formModel.get('oldTokenStatus').setValue(null)
                break
            }
          }
        }
      }),
    )
  }

  tokenAssign() {
    this.executeTokenAction('assign', 'button.assign', true, true)
  }

  tokenRemove() {
    this.executeTokenAction('remove', 'button.remove', true, true)
  }

  tokenBlock() {
    this.executeTokenAction('block', 'button.block', true, true)
  }

  tokenUnblock() {
    this.executeTokenAction('unblock', 'button.unblock', true, true)
  }

  tokenLost() {
    this.executeTokenAction('lost', 'button.lost', true, true)
  }

  tokenNonOperative() {
    this.executeTokenAction('nonOperative', 'button.nonOperative', true, true)
  }

  tokenReset() {
    this.executeTokenAction('reset', 'button.reset', true, true)
  }

  tokenResetNew() {
    this.executeTokenAction('resetNew', 'button.resetNew', true, true)
  }

  tokenResendActivation() {
    this.executeTokenAction('resendActivation', 'button.activation', true, true)
  }

  tokenUnlock() {
    this.isActionUnlock = true
    this.executeTokenAction('unlock', 'button.unlock', true, true)
  }

  checkLimitValidation() {
    this.dailyLimit = this.formModel.controls['locallimit']
      ? this.formModel.controls['locallimit'].value
      : 0
    this.localLimit = this.formModel.controls['limit']
      ? this.formModel.controls['limit'].value
      : 0
    let qtlLimit = this.formModel.controls['qtlLimit']
      ? this.formModel.controls['qtlLimit'].value
      : 0
    if (parseInt(qtlLimit) > parseInt(this.companyMaxQTL)) {
      this.maxLimitBreach = true
      this.formModel.controls['qtlLimit'].setErrors({})
      this.emptyCompanyLimit = false
      this.updatingAdminLimit = false
      this.companyLimitBreach = false
      this.companyLimitError = false
      this.dailyLimitBreached = false
      this.localLimitBreached = false
      return
    } else if (parseInt(qtlLimit) > this.localLimit) {
      this.formModel.controls['qtlLimit'].setErrors({})
      this.updatingAdminLimit = false
      this.companyLimitError = false
      this.maxLimitBreach = false
      this.emptyCompanyLimit = false
      this.companyLimitBreach = false
      this.dailyLimitBreached = false
      this.localLimitBreached = true
      return
    } else if (parseInt(qtlLimit) > this.dailyLimit) {
      this.formModel.controls['qtlLimit'].setErrors({})
      this.updatingAdminLimit = false
      this.companyLimitError = false
      this.maxLimitBreach = false
      this.emptyCompanyLimit = false
      this.companyLimitBreach = false
      this.dailyLimitBreached = true
      this.localLimitBreached = false
      return
    } else if (this.companyQTL && parseInt(this.companyQTL) == 0) {
      if (this.userData.companyUserDetails.type !== 'CA') {
        if (qtlLimit > 0) {
          this.emptyCompanyLimit = true
        }
        this.updatingAdminLimit = false
        this.maxLimitBreach = false
        this.companyLimitBreach = false
        this.companyLimitError = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        this.formModel.controls['qtlLimit'].setErrors({})
        return
      } else {
        this.updatingAdminLimit = false
        this.companyLimitError = false
        this.maxLimitBreach = false
        this.emptyCompanyLimit = false
        this.companyLimitBreach = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        return
      }
    } else if (
      this.companyQTL &&
      parseInt(this.companyQTL) > parseInt(qtlLimit)
    ) {
      if (this.userData.companyUserDetails.type != 'CA') {
        this.companyLimitBreach = false

        this.companyLimitError = false
        this.maxLimitBreach = false
        this.emptyCompanyLimit = false
        this.updatingAdminLimit = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        return
      } else {
        this.updatingAdminLimit = true
        this.companyLimitError = false
        this.maxLimitBreach = false
        this.emptyCompanyLimit = false
        this.companyLimitBreach = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        return
      }
    } else if (
      this.companyQTL &&
      parseInt(this.companyQTL) < parseInt(qtlLimit)
    ) {
      if (this.userData.companyUserDetails.type != 'CA') {
        this.companyLimitBreach = true
        this.updatingAdminLimit = false
        this.companyLimitError = false
        this.maxLimitBreach = false
        this.emptyCompanyLimit = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        this.formModel.controls['qtlLimit'].setErrors({})
        return
      } else {
        this.updatingAdminLimit = false
        this.companyLimitError = false
        this.maxLimitBreach = false
        this.emptyCompanyLimit = false
        this.companyLimitBreach = false
        this.dailyLimitBreached = false
        this.localLimitBreached = false
        return
      }
    } else {
      this.updatingAdminLimit = false
      this.companyLimitError = false
      this.maxLimitBreach = false
      this.emptyCompanyLimit = false
      this.companyLimitBreach = false
      this.dailyLimitBreached = false
      this.localLimitBreached = false
    }
  }

  getCompanyLimit() {
    this.serviceTransfer.ipsConfig().subscribe((result) => {
      if (result instanceof Exception) {
        this.onError(result)
        return
      } else {
        this.companyMaxQTL = result.maxQTL
        this.companyQTL = result.qtl
      }
    })
  }

  closeConfirmationPopUp() {
    this.confirmationPopUp.hide()
    if (this.isActionUnlock) {
      setTimeout(() => this.isActionUnlock = false, 200)
    }
  }

  isLocalExist() {
    return this.formModel.controls['TfLocalGroup'] != null
  }


}
