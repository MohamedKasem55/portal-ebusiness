import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PoSManagementOptionsComponent } from './pos-management-options.component'

import { AddUserComponent } from './ManageUsers/AddUser/add-user.component'
import { AuthGuardManageUser } from './ManageUsers/auth-guard-manage-user.service'
import { DeleteUserComponent } from './ManageUsers/DeleteUser/delete-user.component'
import { ManageUserComponent } from './ManageUsers/manage-user.component'
import { ModifyUserComponent } from './ManageUsers/ModifyUser/modify-user.component'

export const routes: Routes = [
  { path: '', component: PoSManagementOptionsComponent },
  {
    path: 'user-list',
    component: ManageUserComponent,
  },
  {
    path: 'add-pos-user',
    canActivate: [AuthGuardManageUser],
    component: AddUserComponent,
  },
  {
    path: 'delete-pos-user',
    canActivate: [AuthGuardManageUser],
    component: DeleteUserComponent,
  },
  {
    path: 'modify-pos-user',
    canActivate: [AuthGuardManageUser],
    component: ModifyUserComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoSRoutingModule {}
