import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { SharedModule } from '../shared/shared.module'
import { ChangePasswordStep1Component } from './ChangePassword/change-password-step1.component'
import { ChangePasswordStep2Component } from './ChangePassword/change-password-step2.component'
import { ChangePasswordComponent } from './ChangePassword/change-password.component'
import { ChangePasswordService } from './ChangePassword/change-password.service'
import { OrganizationDetailsComponent } from './OrganizationDetails/organization-details.component'
import { OrganizationDetailsService } from './OrganizationDetails/organization-details.service'
import { PreferencesRoutingModule } from './preferences-routing.module'
import { UpdateMailStep1Component } from './UpdateUser/update-mail-step1.component'
import { UpdateMailStep2Component } from './UpdateUser/update-mail-step2.component'
import { UpdateMailService } from './UpdateUser/update-mail.service'
import { UserProfileComponent } from './UserProfile/user-profile.component'
import { UpdateUserDetailsComponent } from './UpdateUser/update-user-details-component'
import { TransferLocalService } from '../Transfers/Services/transfer-local.service'

@NgModule({
  imports: [
    AppSharedModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    PreferencesRoutingModule,
  ],
  declarations: [
    UserProfileComponent,
    OrganizationDetailsComponent,
    ChangePasswordComponent,
    ChangePasswordStep1Component,
    ChangePasswordStep2Component,
    UserProfileComponent,
    UpdateUserDetailsComponent,
    UpdateMailStep1Component,
    UpdateMailStep2Component,
  ],
  providers: [
    OrganizationDetailsService,
    ChangePasswordService,
    OrganizationDetailsService,
    UpdateMailService,
    TransferLocalService,
  ],
  exports: [
    ChangePasswordStep1Component,
    ChangePasswordStep2Component,
    UpdateMailStep1Component,
    UpdateMailStep2Component,
  ],
})
export class PreferencesModule {}
