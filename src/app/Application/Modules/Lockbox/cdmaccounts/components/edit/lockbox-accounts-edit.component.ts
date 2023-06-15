import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Router } from '@angular/router'
import { LockboxAccountsEditService } from './lockbox-accounts-edit.service'
import { LockboxAccountsDetailsService } from '../details/lockbox-accounts-details.service'

@Component({
  selector: 'app-lockbox-accounts-edit',
  templateUrl: './lockbox-accounts-edit.component.html',
  styleUrls: ['./lockbox-accounts-edit.component.scss'],
})
export class LockboxAccountsEditComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedItem: any

  editData: any

  entityProperties: any[] = []

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmAccounts.menu', ['/lockbox/cdm-accounts/list']],
    ['lockbox.cdmAccounts.details.menu', ['/lockbox/cdm-accounts/details']],
    ['lockbox.cdmAccounts.edit.menu'],
  ]

  constructor(
    public editService: LockboxAccountsEditService,
    public detailsService: LockboxAccountsDetailsService,
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
    this.selectedItem = this.detailsService.getSelectedItemDetailsData()
    if (!this.selectedItem || !this.selectedItem.accountPk) {
      this.router.navigate([this.getBackUrl()])
    } else {
      this.editData = Object.assign(
        {},
        {
          account: this.selectedItem,
        },
      )
      this.entityProperties = this.editService.configureEditFormModel(
        this.selectedItem,
      )
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getBackUrl() {
    return '/lockbox/cdm-accounts/list'
  }
}
