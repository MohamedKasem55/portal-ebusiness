import {Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { CompanyAdminUserManagementListService } from '../../../../CompanyAdmin/CompanyUser/list/company-admin-user-management-list.service'
import { CompanyAdminUserManagementSelectedDataService } from '../../../../CompanyAdmin/CompanyUser/list/company-admin-user-management-selected-data.service'
import { Exception } from 'app/Application/Model/exception'
import { UserDetails } from '../../../../CompanyAdmin/Model/userDetails'
import { UserDetailsBackEndAccountPrivileges } from '../../../../CompanyAdmin/Model/UserDetailsBackEndAccountPrivileges'
import { Account } from 'app/Application/Model/account'
import {CompanyAdminUserManagementEditFormService} from "../../../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service";
import {StorageService} from "../../../../../../core/storage/storage.service";
import { companyEtradeFunctionList } from 'app/Application/Model/eTradePrivilege/eTradePrivilege'
import { userEtrade } from 'app/Application/Model/eTradePrivilege/userEtrade'

@Component({
  templateUrl: './company-admin-user-management-pa-details-user.component.html',
  selector: 'company-admin-user-management-pa-details-user',
})

// Component class implementing OnInit
export class CompanyAdminUserManagementPaDetailsUserComponent
    extends DatatableMobileComponent
    implements OnInit, OnDestroy
{
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective
  // Private properties for binding

  selectedUser: any

  dataForm: any;

  formModel: FormGroup
  userData: any = {}

  combosKeys = []
  combosData: any = {}

  mensajeError: any = {};

  @Input() userDetailResponse: any

  imgUrl: string

  authenticationAvailable: any
  showSoftToken: boolean
  showStaticPassword: boolean



  messageError: any = {}
  alertPrivilege: any

  vaPermissions: any[] = []

  subscriptions: Subscription[] = []

  constructor(
      public fb: FormBuilder,
      public route: ActivatedRoute,
      public router: Router,
      public listService: CompanyAdminUserManagementListService,
      public formService: CompanyAdminUserManagementEditFormService,
      public selectedUserDataService: CompanyAdminUserManagementSelectedDataService,
      public staticService: StaticService,
      private storageService: StorageService,
      @Inject(LOCALE_ID) private _locale: string,
  ) {
    super()

    this.combosData['tokens'] = []
  }

  ngOnInit() {
    super.ngOnInit()

    this.listService.getInit().subscribe((result: any) => {
      if (result instanceof Exception) {
        this.onError(result);
        return;
      } else {
        this.dataForm = result;

        if (this.dataForm.unassignedHardSerialList.length > 0) {
          this.dataForm.unassignedHardSerialList.forEach(hardToken => {
            this.combosData['tokens'].push(
                hardToken
            )
          });
        }

        if (this.dataForm.unassignedSoftSerialList.length > 0) {
          this.dataForm.unassignedSoftSerialList.forEach(softToken => {
            this.combosData['tokens'].push(
                softToken
            )
          });
        }

        this.userData = this.dataForm

        this.selectedUser = this.userDetailResponse['user']

        this.messageError = {}

        this.userData.companyUserDetails = this.selectedUser
        this.userData.accountList = this.selectedUser.accounts
        this.userData.backEndAccountPrivileges = this.selectedUser.backEndAccountPrivilegesDTO
        this.userData.companyUserDetails.type = this.selectedUser.typeUser
        this.userData.companyUserDetails.userStatus = '' // 'P' value is not included in Model to transform
        // this.userData.userImage = this.selectedUser.userImage

        const groups = []
        this.selectedUser.groups.forEach(group => {
          groups.push(group.groupId)
        });
        this.userData.selectPrivilegeIndex = groups


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

        this.formModel = this.formService.createUserForm(
            this.userData,
            false,
        )
      }
    })
  }

  onError(error: any) {
    const res = error;
    this.mensajeError["code"] = res.errorCode;
    this.mensajeError["description"] = res.errorDescription;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
