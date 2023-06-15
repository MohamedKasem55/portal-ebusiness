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
import { LockboxUsersChangeStatusService } from './lockbox-users-change-status.service'

@Component({
  selector: 'app-lockbox-users-change-status',
  templateUrl: './lockbox-users-change-status.component.html',
  styleUrls: ['./lockbox-users-change-status.component.scss'],
})
export class LockboxUsersChangeStatusComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedAction = ''
  selectedActionMsg = ''

  selectedItem: any

  suspendData: any = {}

  entityProperties: any[] = []

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.details.menu', ['/lockbox/cdm-users/details']],
    ['lockbox.cdmUsers.suspend.menu'],
  ]

  combosKeys: any[] = []
  combosData: any = {}

  constructor(
    public changeStatusService: LockboxUsersChangeStatusService,
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
    this.selectedAction = this.changeStatusService.getAction()
    switch (this.selectedAction) {
      case 'suspend':
        this.selectedActionMsg = 'lockbox.cdmUsers.suspend.menu'
        break
      case 'unsuspend':
        this.selectedActionMsg = 'lockbox.cdmUsers.unsuspend.menu'
        break
      case 'reactivate':
        this.selectedActionMsg = 'lockbox.cdmUsers.reactivate.menu'
        break
    }

    if (!this.selectedItem || !this.selectedItem.lbUserPK) {
      this.router.navigate([this.getBackUrl()])
    } else {
      this.suspendData = Object.assign(
        {},
        this.detailsService.getSelectedItemDetailsData(),
      )

      this.combosData['regionList'] = []
      if (
        this.suspendData.lockBoxUser &&
        this.suspendData.lockBoxUser.regionPK &&
        this.suspendData.lockBoxUser.regionName
      ) {
        this.combosData['regionList'].push({
          key: this.suspendData.lockBoxUser.regionPK,
          value: this.suspendData.lockBoxUser.regionName,
        })
      }
      /*
       * We transform the city combo
       */
      this.combosData['cityList'] = []
      if (
        this.suspendData.lockBoxUser &&
        this.suspendData.lockBoxUser.cityPK &&
        this.suspendData.lockBoxUser.cityName
      ) {
        this.combosData['cityList'].push({
          key: this.suspendData.lockBoxUser.cityPK,
          value: this.suspendData.lockBoxUser.cityName,
        })
      }

      this.entityProperties =
        this.changeStatusService.configureSuspendFormModel(
          this.suspendData.lockBoxUser,
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
