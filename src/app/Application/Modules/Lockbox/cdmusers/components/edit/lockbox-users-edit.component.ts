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
import { LockboxUsersEditService } from './lockbox-users-edit.service'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'

@Component({
  selector: 'app-lockbox-users-edit',
  templateUrl: './lockbox-users-edit.component.html',
  styleUrls: ['./lockbox-users-edit.component.scss'],
})
export class LockboxUsersEditComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedItem: any

  editData: any = {}

  entityProperties: any[] = []

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.details.menu', ['/lockbox/cdm-users/details']],
    ['lockbox.cdmUsers.edit.menu'],
  ]

  combosKeys: any[] = []
  combosData: any = {}

  terminalAccountsFieldsConfigForExport: any[] = []
  terminalAccountsFieldsConfigForList: any[] = []

  constructor(
    public editService: LockboxUsersEditService,
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
          this.editData = null

          this.subscriptions.push(
            this.editService.init(this.selectedItem).subscribe((response) => {
              this.editData = Object.assign(
                {},
                this.editService.getSelectedItemEditData(),
              )

              if (!this.editData) {
                this.router.navigate([this.getBackUrl()])
                return
              }

              this.combosData['regionList'] = []
              if (this.editData.regionList) {
                this.editData.regionList.forEach((region) => {
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
                this.editData.lockBoxUser &&
                this.editData.lockBoxUser.regionPK &&
                this.editData.lockBoxUser.regionName
              ) {
                this.combosData['regionList'].push({
                  key: this.editData.lockBoxUser.regionPK,
                  value: this.editData.lockBoxUser.regionName,
                })
              }
              /*
               * We transform the city combo
               */
              this.combosData['cityList'] = []
              if (this.editData.cityList) {
                this.editData.cityList.forEach((city, i) => {
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
                  this.combosData['cityList' + regionKey].push(transformedCity)
                })
              } else if (
                this.editData.lockBoxUser &&
                this.editData.lockBoxUser.cityPK &&
                this.editData.lockBoxUser.cityName
              ) {
                this.combosData['cityList'].push({
                  key: this.editData.lockBoxUser.cityPK,
                  value: this.editData.lockBoxUser.cityName,
                })
              }

              this.entityProperties = this.editService.configureEditFormModel(
                this.editData.lockBoxUser,
              )

              this.terminalAccountsFieldsConfigForList =
                this.detailsService.getTerminalAccountsFieldsConfigForList()
              this.terminalAccountsFieldsConfigForExport =
                this.detailsService.getTerminalAccountsFieldsConfigForExport()
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
  }
}
