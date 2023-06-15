import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AddUserStep1Component } from './ManageUsers/AddUser/add-user-step1.component'
import { AddUserStep2Component } from './ManageUsers/AddUser/add-user-step2.component'
import { AddUserStep3Component } from './ManageUsers/AddUser/add-user-step3.component'
import { AddUserComponent } from './ManageUsers/AddUser/add-user.component'
import { AuthGuardManageUser } from './ManageUsers/auth-guard-manage-user.service'
import { DeleteUserStep2Component } from './ManageUsers/DeleteUser/delete-user-step2.component'
import { DeleteUserStep3Component } from './ManageUsers/DeleteUser/delete-user-step3.component'
import { DeleteUserComponent } from './ManageUsers/DeleteUser/delete-user.component'
import { ManageUserComponent } from './ManageUsers/manage-user.component'
import { ManageUserService } from './ManageUsers/manage-user.service'
import { ModifyUserStep1Component } from './ManageUsers/ModifyUser/modify-user-step1.component'
import { ModifyUserStep2Component } from './ManageUsers/ModifyUser/modify-user-step2.component'
import { ModifyUserStep3Component } from './ManageUsers/ModifyUser/modify-user-step3.component'
import { ModifyUserComponent } from './ManageUsers/ModifyUser/modify-user.component'
import { UserShareService } from './ManageUsers/user-share.service'
import { PoSRoutingModule } from './module-routes'
import { PoSManagementOptionsComponent } from './pos-management-options.component'

// Services

@NgModule({
  declarations: [
    PoSManagementOptionsComponent,
    ManageUserComponent,
    AddUserComponent,
    AddUserStep1Component,
    AddUserStep2Component,
    AddUserStep3Component,
    ModifyUserComponent,
    ModifyUserStep1Component,
    ModifyUserStep2Component,
    ModifyUserStep3Component,
    DeleteUserComponent,
    DeleteUserStep2Component,
    DeleteUserStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PoSRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [UserShareService, ManageUserService, AuthGuardManageUser],
  exports: [
    PoSManagementOptionsComponent,
    ManageUserComponent,
    AddUserComponent,
    AddUserStep1Component,
    AddUserStep2Component,
    AddUserStep3Component,
    ModifyUserComponent,
    ModifyUserStep1Component,
    ModifyUserStep2Component,
    ModifyUserStep3Component,
    DeleteUserComponent,
    DeleteUserStep2Component,
    DeleteUserStep3Component,
  ],
})
export class PoSModuleImpl {}
