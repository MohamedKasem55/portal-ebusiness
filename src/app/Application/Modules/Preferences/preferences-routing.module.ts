import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChangePasswordComponent } from './ChangePassword/change-password.component'
import { OrganizationDetailsComponent } from './OrganizationDetails/organization-details.component'
import { UserProfileComponent } from './UserProfile/user-profile.component'
import { UpdateUserDetailsComponent } from './UpdateUser/update-user-details-component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'organizationDetails',
    pathMatch: 'full',
  },
  {
    path: 'organizationDetails',
    component: OrganizationDetailsComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'updateUserDetails',
    component: UpdateUserDetailsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferencesRoutingModule {}
