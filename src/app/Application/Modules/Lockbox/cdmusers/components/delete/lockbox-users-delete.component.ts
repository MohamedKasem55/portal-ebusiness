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
import { LockboxUsersDeleteService } from './lockbox-users-delete.service'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'

@Component({
  selector: 'app-lockbox-users-delete',
  templateUrl: './lockbox-users-delete.component.html',
  styleUrls: ['./lockbox-users-delete.component.scss'],
})
export class LockboxUsersDeleteComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedItem: any

  deleteData: any = {}

  entityProperties: any[] = []

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.details.menu', ['/lockbox/cdm-users/details']],
    ['lockbox.cdmUsers.delete.menu'],
  ]

  combosKeys: any[] = []
  combosData: any = {}

  constructor(
    public deleteService: LockboxUsersDeleteService,
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
    } else {
      this.deleteData = Object.assign(
        {},
        this.detailsService.getSelectedItemDetailsData(),
      )

      this.combosData['regionList'] = []
      if (
        this.deleteData.lockBoxUser &&
        this.deleteData.lockBoxUser.regionPK &&
        this.deleteData.lockBoxUser.regionName
      ) {
        this.combosData['regionList'].push({
          key: this.deleteData.lockBoxUser.regionPK,
          value: this.deleteData.lockBoxUser.regionName,
        })
      }
      /*
       * We transform the city combo
       */
      this.combosData['cityList'] = []
      if (
        this.deleteData.lockBoxUser &&
        this.deleteData.lockBoxUser.cityPK &&
        this.deleteData.lockBoxUser.cityName
      ) {
        this.combosData['cityList'].push({
          key: this.deleteData.lockBoxUser.cityPK,
          value: this.deleteData.lockBoxUser.cityName,
        })
      }

      this.entityProperties = this.deleteService.configureDeleteFormModel(
        this.deleteData.lockBoxUser,
      )
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getBackUrl() {
    return '/lockbox/cdm-users/list'
  }

  initFormCreated($event) {
    $event.form.disable()
  }
}
