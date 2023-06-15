import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { LockboxUsersDetailsService } from './lockbox-users-details.service'
import { LockboxUsersChangeStatusService } from '../change-status/lockbox-users-change-status.service'

@Component({
  selector: 'app-lockbox-users-details',
  templateUrl: './lockbox-users-details.component.html',
  styleUrls: ['./lockbox-users-details.component.scss'],
})
export class LockboxUsersDetailsComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedItem: any

  detailsData: any

  entityProperties: any[] = []

  formModel: FormGroup

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.details.menu'],
  ]

  // ----------------------------

  combosKeys: any[] = [
    'lockBoxUserRole',
    'lockBoxUserStatus',
    'lockBoxTerminalStatus',
    // 'lockBoxMachineVendor',
    // 'lockBoxTerminalStatus',
    // 'process',
    // 'processStatus',
  ]

  combosData: any = {}

  terminalAccountsFieldsConfigForExport: any[] = []
  terminalAccountsFieldsConfigForList: any[] = []

  constructor(
    public detailsService: LockboxUsersDetailsService,
    public changeStatusService: LockboxUsersChangeStatusService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(translate)

    this.combosData = {}

    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    this.selectedItem = this.detailsService.getSelectedItem()

    if (!this.selectedItem || !this.selectedItem.lbUserPK) {
      this.router.navigate([this.getBackUrl()])
      return
    }

    super.ngOnInit()
  }

  refreshData() {
    this.loadDataAndConfig()
  }

  loadDataAndConfig() {
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
          this.detailsData = null
          this.subscriptions.push(
            this.detailsService
              .detail(this.selectedItem)
              .subscribe((response) => {
                this.detailsData =
                  this.detailsService.getSelectedItemDetailsData()

                if (!this.detailsData) {
                  this.router.navigate([this.getBackUrl()])
                  return
                }

                this.combosData['regionList'] = []
                if (this.detailsData.regionList) {
                  this.detailsData.regionList.forEach((region) => {
                    this.combosData['regionList'].push({
                      key: region['regionPK'],
                      value: region['name'],
                    })
                    /*
                     * Adding a combo data for each Region
                     * and pushing child cities
                     */
                    this.combosData['cityList' + region['regionPK']] = this
                      .combosData['cityList' + region['regionPK']]
                      ? this.combosData['cityList' + region['regionPK']]
                      : []
                  })
                } else if (
                  this.detailsData.lockBoxUser &&
                  this.detailsData.lockBoxUser.regionPK &&
                  this.detailsData.lockBoxUser.regionName
                ) {
                  this.combosData['regionList'].push({
                    key: this.detailsData.lockBoxUser.regionPK,
                    value: this.detailsData.lockBoxUser.regionName,
                  })
                }
                /*
                 * We transform the city combo
                 */
                this.combosData['cityList'] = []
                if (this.detailsData.cityList) {
                  this.detailsData.cityList.forEach((city, i) => {
                    const regionKey = city['regionPK']
                    const transformedCity = {
                      key: city['cityPK'],
                      value: city['name'],
                    }
                    this.combosData['cityList'].push(transformedCity)
                    /*
                     * Adding a combo data for each Region
                     * and pushing child cities
                     */
                    this.combosData['cityList' + regionKey] = this.combosData[
                      'cityList' + regionKey
                    ]
                      ? this.combosData['cityList' + regionKey]
                      : []
                    this.combosData['cityList' + regionKey].push(
                      transformedCity,
                    )
                  })
                } else if (
                  this.detailsData.lockBoxUser &&
                  this.detailsData.lockBoxUser.cityPK &&
                  this.detailsData.lockBoxUser.cityName
                ) {
                  this.combosData['cityList'].push({
                    key: this.detailsData.lockBoxUser.cityPK,
                    value: this.detailsData.lockBoxUser.cityName,
                  })
                }

                this.entityProperties =
                  this.detailsService.configureDetailsFormModel(
                    this.detailsData.lockBoxUser,
                  )

                this.terminalAccountsFieldsConfigForList =
                  this.detailsService.getTerminalAccountsFieldsConfigForList()
                this.terminalAccountsFieldsConfigForExport =
                  this.detailsService.getTerminalAccountsFieldsConfigForExport()
              }),
          )
          // -------------------------------------------------
        }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  formConfigured(event) {
    this.formModel.disable()
  }

  canExecuteAction(action) {
    switch (action) {
      case 'edit':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          (this.detailsData.lockBoxUser.status == 'A' ||
            this.detailsData.lockBoxUser.status == 'S' ||
            this.detailsData.lockBoxUser.status == 'E') &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      case 'delete':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          (this.detailsData.lockBoxUser.status == 'A' ||
            this.detailsData.lockBoxUser.status == 'S' ||
            this.detailsData.lockBoxUser.status == 'E') &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      case 'suspend':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          this.detailsData.lockBoxUser.status == 'A' &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      case 'unsuspend':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          this.detailsData.lockBoxUser.status == 'S' &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      case 'reactivate':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          this.detailsData.lockBoxUser.status == 'E' &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      case 'accounts':
        return (
          this.detailsData &&
          this.detailsData.lockBoxUser &&
          this.detailsData.lockBoxUser.status != 'D' &&
          this.detailsData.lockBoxUser.status != 'I' &&
          this.authenticationService.activateOption(
            'LockBoxUsers',
            ['LOCKBOX_PRIVILEGE'],
            ['LockboxGroupAdmin'],
          )
        )
      default:
        break
    }
    return false
  }

  isDisabledAction(action) {
    switch (action) {
      case 'edit':
        return false
      case 'delete':
        return false
      case 'suspend':
        return false
      case 'unsuspend':
        return false
      case 'reactivate':
        return false
      case 'accounts':
        return false
      default:
        break
    }
    return false
  }

  executeAction(action) {
    switch (action) {
      case 'edit':
        return this.router.navigate(['/lockbox/cdm-users/edit'])
      case 'delete':
        return this.router.navigate(['/lockbox/cdm-users/delete'])
      case 'suspend':
        this.changeStatusService.setAction('suspend')
        return this.router.navigate(['/lockbox/cdm-users/change-status'])
      case 'unsuspend':
        this.changeStatusService.setAction('unsuspend')
        return this.router.navigate(['/lockbox/cdm-users/change-status'])
      case 'reactivate':
        this.changeStatusService.setAction('reactivate')
        return this.router.navigate(['/lockbox/cdm-users/change-status'])
      case 'accounts':
        return this.router.navigate(['/lockbox/cdm-users/accounts'])
      default:
        break
    }
    return false
  }

  getBackUrl() {
    return '/lockbox/cdm-users/list'
  }
}
