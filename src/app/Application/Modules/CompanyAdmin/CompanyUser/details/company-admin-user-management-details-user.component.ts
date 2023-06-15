import {
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Exception } from 'app/Application/Model/exception'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { CompanyAdminUserManagementEditFormService } from '../../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'
import { StaticService } from '../../../Common/Services/static.service'
import { CompanyAdminUserManagementListService } from '../list/company-admin-user-management-list.service'
import { CompanyAdminUserManagementSelectedDataService } from '../list/company-admin-user-management-selected-data.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { CompanyAdminUserManagementEditService } from '../edit/company-admin-user-management-edit.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { SessionStorageService } from 'ngx-webstorage'
import { SecuredAuthentication } from 'app/Application/Components/secured-authentication/secured-authentication.component'
import { eTradePrivilege } from '../../../../Model/eTradePrivilege/eTradePrivilege'

@Component({
  templateUrl: './company-admin-user-management-details-user.component.html',
})
// Component class implementing OnInit
export class CompanyAdminUserManagementDetailsUserComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy {
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective
  @ViewChild('requestPassSubmittedModal', { static: true })
  public requestPassSubmittedModal: ModalDirective
  @ViewChild('noAuthModal', { static: true })
  public noAuthModal: ModalDirective
  // Private properties for binding

  selectedUser: any

  formModel: FormGroup
  userData: any = {}
  company: any = null

  combosKeys = []
  combosData: any = {}

  messageError: any = {}

  subscriptions: Subscription[] = []
  dataToValidate: any = {}
  dataToConfirm: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge = null
  @ViewChild(SecuredAuthentication) authorization: SecuredAuthentication;
  requestValidate: RequestValidate


  isBlock = false;
  isUnblock = false;
  isResetPassword = false;
  isDeleteUser = false;

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public listService: CompanyAdminUserManagementListService,
    public formService: CompanyAdminUserManagementEditFormService,
    public deleteService: CompanyAdminUserManagementEditService,
    public editService: CompanyAdminUserManagementEditService,
    public selectedUserDataService: CompanyAdminUserManagementSelectedDataService,
    public staticService: StaticService,
    private storageService: StorageService,
    private sessionStorage: SessionStorageService,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super()
    this.selectedUser = this.selectedUserDataService.getSelectedUser()
    if (this.selectedUser == null) {
      this.back()
    }

    this.combosData['tokens'] = []
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    super.ngOnInit()
    this.selectedUser = this.selectedUserDataService.getSelectedUser()
    if (!this.selectedUser) {
      this.back()
    }
    this.company = this.storageService.retrieve('company');
    this.messageError = {}

    this.subscriptions.push(
      this.listService
        .detailsUser(this.selectedUser.userId)
        .subscribe((result: any) => {
          if (
            result.hasOwnProperty('error') &&
            result.error instanceof Exception
          ) {
            const res = result as any

            this.messageError['code'] = res.error.errorCode
            this.messageError['description'] = res.error.errorDescription
          } else {
            this.messageError = {}

            this.userData = result
            const user = this.userData.companyUserDetails

            this.combosData['tokens'].push(
              this.userData.unassignedHardSerialList,
            )
            this.combosData['tokens'].push(
              this.userData.unassignedSoftSerialList,
            )

            this.combosData['tokens'].push(user.tokenSerial)

            // TODO
            if (this.userData['companyUserDetails']['vaPermissions']) {
              this.combosData['vaPermissions'] = []
              this.userData['companyUserDetails']['vaPermissions'].forEach(
                (p) => {
                  if (p['value'] === '-- Select one --') {
                    p['key'] = null
                  } else {
                    this.combosData['vaPermissions'].push(p)
                  }
                },
              )
            }

            this.formService.getCompanyEtradePrivilege(this.company.profileNumber).subscribe((response: eTradePrivilege) => {
              const eTradePrivileges = response.companyEtradeFunctionList
              this.userData.eTradePrivileges = eTradePrivileges

            this.formModel = this.formService.createUserForm(
              this.userData,
              false,
                true,
            )

            })
          }
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  //---------------------------------------------------

  //-----------------------------------------

  hideDeleteButton() {
    const userStorage = JSON.parse(this.storageService.retrieve('currentUser'))
    if (
      this.userData == null ||
      this.selectedUser.userId === userStorage.user.userId
    ) {
      return true
    } else {
      return false
    }
  }

  hiddeEditButton() {
    if (this.userData == null) {
      return true
    } else {
      return false
    }
  }

  hiddeResetPassword() {
    if (this.userData == null) {
      return true
    } else {
      return false
    }
  }

  hideBlockButton() {
    if (!this.userData || !this.userData.companyUserDetails) {
      return true
    } else {
      return (
        this.userData.companyUserDetails.blocked === '1' ||
        this.userData.companyUserDetails.tries >=
        this.userData.companyUserDetails.maxTries
      )
    }
  }

  hiddeUnblockButton() {
    if (!this.userData || !this.userData.companyUserDetails) {
      return true
    } else {
      return (
        this.userData.companyUserDetails.blocked !== '1' &&
        this.userData.companyUserDetails.tries <
        this.userData.companyUserDetails.maxTries
      )
    }
  }

  public showNoAuth(reference): void {

    switch (reference) {
      case 'block':
        this.isBlock = true;
        this.noAuthModal.show();
        break;
      case 'unblock':
        this.prepareDataToValidate(
          this.dataToValidate,
          this.formModel,
          this.userData,
          this.selectedUser.userPk,
          this.company,
        )
        this.subscriptions.push(
          this.editService
            .validateModifyUser(this.dataToValidate)
            .subscribe((result: any) => {
              if (result instanceof Exception) {
                const res = result as any
                this.messageError['code'] = res.errorCode
                this.messageError['description'] = res.errorDescription
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
                this.noAuthModal.show();
              }
            }),
        )
        this.isUnblock = true;
        break;
      case 'reset':
        this.isResetPassword = true;
        this.noAuthModal.show();
        break;
      case 'delete':
        this.isDeleteUser = true;
        this.noAuthModal.show();
        break;
    }

  }

  public onConfirmNoAuth(): void {

    if (this.isBlock) {
      this.onlyBlock();
    } else if (this.isUnblock) {
      this.unblock();
    } else if (this.isResetPassword) {
      this.resetPassword();
    } else if (this.isDeleteUser) {
      this.delete();
    }

    this.noAuthModal.hide();
    this.isBlock = false;
    this.isResetPassword = false;
    this.isDeleteUser = false;

  }
  public onCancelNoAuth(): void {
  this.isBlock = false;
  this.isUnblock = false;
  this.isResetPassword = false;
  this.isDeleteUser = false;
  this.noAuthModal.hide();
  }
  edit() {
    this.selectedUserDataService.setFormData(this.userData)
    this.selectedUserDataService.setSelectedUser(this.selectedUser)
    this.selectedUserDataService.setForm(this.formModel)
    this.router.navigate(['/companyadmin/user/edit'])
  }

  delete() {
    this.selectedUserDataService.setFormData(this.userData)
    this.selectedUserDataService.setSelectedUser(this.selectedUser)
    this.selectedUserDataService.setForm(this.formModel)
    this.deleteUser(this.userData['companyUserDetails']);
    // this.router.navigate(['/companyadmin/user/delete'])
  }

  sendMailAndBlock() {
    this.block(true)
  }

  onlyBlock() {
    this.block(false)
  }

  resetPassword() {
    //  const result = this.userData;
    this.messageError = {}
    this.subscriptions.push(
      this.listService
        .resetPassword(this.selectedUser.userId)
        .subscribe((result: any) => {
          if (result instanceof Exception) {
            const res = result as any
            //console.log(res.error);
            this.messageError['code'] = res.error.errorCode
            this.messageError['description'] = res.error.errorDescription
          } else {
            this.messageError = {}
            this.requestPassSubmittedModal.show()
          }
        }),
    )
  }

  block(mail) {
    //  const result = this.userData;
    this.messageError = {}
    this.subscriptions.push(
      this.listService
        .blockUser(this.selectedUser.userId, mail)
        .subscribe((result: any) => {
          if (result instanceof Exception) {
            const res = result as any
            //console.log(res.error);
            this.messageError['code'] = res.error.errorCode
            this.messageError['description'] = res.error.errorDescription
          } else {
            this.messageError = {}
            this.requestSubmittedModal.show()
          }
        }),
    )
  }

  unblock() {
    //  const result = this.userData;
    this.messageError = {}

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
            this.requestSubmittedModal.show()
          }
        })
    )
  }

  back() {
    this.router.navigate(['/companyadmin/manage/user'])
  }

  deleteUser(userSelected: any) {
    userSelected['typeOperation'] = 'DL';

    if (userSelected.groups.length > 0) {
      userSelected.groups = this.convertArrayGroupToObject(userSelected);
    }

    const param = { generateChallengeAndOTP: null, requestValidate: {}, user: userSelected }
    this.subscriptions.push(
      this.deleteService
        .modifyUser(param)
        .subscribe((result) => {
          if (result && result.errorCode != '0') {
            const res = <any>result;
            this.messageError['code'] = res.errorCode;
            this.messageError['description'] = res.errorDescription;
          } else {
            this.messageError = {}
            this.router.navigate(['/companyadmin/workflow/requestStatus/details-deleteOneStep']);
          }
        }),
    )
  }

  prepareDataToValidate(
    dataToValidate,
    formModel: FormGroup,
    userData,
    userPk,
    company = null,
  ) {
    dataToValidate['typeOperation'] = 'UB'
    dataToValidate['profileNumber'] = company ? company.profileNumber : null

    this.formService.setFormModelToData(
      dataToValidate,
      formModel,
      userData,
      userPk,
    )
  }

  convertArrayGroupToObject(userSelected: any) {
    const arrayObjectGroup = [];

    userSelected.groups.map(element => {
      element = { "groupId": element }
      arrayObjectGroup.push(element);
    });
    return arrayObjectGroup;
  }

  enableButton(){
    if (this.generateChallengeAndOTP === null) {
      return true
    } else {
      return this.authorization ? this.authorization.valid() : true
    }
  }
}
