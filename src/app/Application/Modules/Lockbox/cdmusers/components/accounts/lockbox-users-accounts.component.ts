import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Router } from '@angular/router'
import { LockboxUsersDetailsService } from '../details/lockbox-users-details.service'
import { LockboxUsersAccountsService } from './lockbox-users-accounts.service'
import { SelectionType } from '@swimlane/ngx-datatable'

@Component({
  selector: 'app-lockbox-users-accounts',
  templateUrl: './lockbox-users-accounts.component.html',
  styleUrls: ['./lockbox-users-accounts.component.scss'],
})
export class LockboxUsersAccountsComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  accountsForm: FormGroup

  selectedItem: any

  accountsData: any = {}

  entityProperties: any[] = []

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.details.menu', ['/lockbox/cdm-users/details']],
    ['lockbox.cdmUsers.accounts.menu'],
  ]

  combosKeys: any[] = []
  combosData: any = {}

  terminalAccountsFieldsConfigForExport1: any[] = []
  terminalAccountsFieldsConfigForList1: any[] = []
  terminalAccountsFieldsConfigForExport2: any[] = []
  terminalAccountsFieldsConfigForList2: any[] = []

  constructor(
    public accountsService: LockboxUsersAccountsService,
    public detailsService: LockboxUsersDetailsService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(translate)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()

    this.selectedItem = this.detailsService.getSelectedItem()

    if (!this.selectedItem || !this.selectedItem.lbUserPK) {
      this.router.navigate([this.getBackUrl()])
    }

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          // -------------------------------------------------
          this.accountsData = null

          this.subscriptions.push(
            this.accountsService
              .init(this.selectedItem)
              .subscribe((response) => {
                //this.accountsData = Object.assign({}, this.accountsService.getSelectedItemAccountsData())
                this.accountsData =
                  this.accountsService.getSelectedItemAccountsData()

                if (!this.accountsData) {
                  this.router.navigate([this.getBackUrl()])
                  return
                }

                const detailsData =
                  this.detailsService.getSelectedItemDetailsData()
                this.accountsData.lockBoxUser = Object.assign(
                  {},
                  detailsData.lockBoxUser,
                )
                this.accountsData.terminalAccountsListNewSelected = []
                this.accountsData.terminalAccountsListAssignedSelected = []
                this.accountsData.terminalAccountsListAssignedSelected.push(
                  ...this.accountsData.lockBoxUserTerminalAccountsAssignedList,
                )

                this.combosData['terminalList'] = []

                this.accountsData.listTerminals.forEach((t) => {
                  this.combosData['terminalList'].push({
                    key: t,
                    value: t.terminalIDName,
                  })
                })

                this.entityProperties =
                  this.accountsService.configureAccountsFormModel(
                    this.accountsData.lockBoxUser,
                  )

                this.terminalAccountsFieldsConfigForList1 =
                  this.accountsService.getTerminalAccountsFieldsConfigForList1()
                this.terminalAccountsFieldsConfigForExport1 =
                  this.accountsService.getTerminalAccountsFieldsConfigForExport1()
                this.terminalAccountsFieldsConfigForList2 =
                  this.accountsService.getTerminalAccountsFieldsConfigForList2()
                this.terminalAccountsFieldsConfigForExport2 =
                  this.accountsService.getTerminalAccountsFieldsConfigForExport2()
              }),
          )
        }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getBackUrl() {
    return '/lockbox/cdm-users/list'
  }

  initFormCreated($event) {
    //$event.form.enable();
    this.accountsForm = $event.form
    this.accountsForm.get('terminalPK').valueChanges.subscribe((value) => {
      if (value) {
        this.accountsService.getTerminalList(value).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.accountsData.lockBoxUserTerminalAccountsNewList =
              result['accountList']
            this.accountsData.terminalAccountsListNewSelected = []
          }
        })
      } else {
        this.accountsData.lockBoxUserTerminalAccountsNewList = []
        this.accountsData.terminalAccountsListNewSelected = []
      }
    })
  }

  getAccountsTableSelectionType() {
    return SelectionType.checkbox
  }

  onTableSelectNew($event) {
    this.accountsData.terminalAccountsListNewSelected = $event.selected
  }

  onTableSelectAssigned($event) {
    this.accountsData.terminalAccountsListAssginedSelected = $event.selected
  }

  getRowIdentityFn1() {
    return this.getId1.bind(this)
  }

  public getId1(row) {
    return row['fullAccountNumber']
  }

  getRowIdentityFn2() {
    return this.getId2.bind(this)
  }

  public getId2(row) {
    return (
      row['terminalPk'] + '-' + row['accountPk'] + '-' + row['accountNumber']
    )
  }
}
