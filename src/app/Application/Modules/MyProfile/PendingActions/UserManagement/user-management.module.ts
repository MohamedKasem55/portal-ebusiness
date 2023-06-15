import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserManagementPendingActionComponent } from './pendingactions/user-management-pending-action.component'
import { UserManagementGuard } from './user-management.guard'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { UserManagementRoutingModule } from './user-management-routing.module'
import { UserManagementPendingActionService } from './pendingactions/user-management-pending-action.service'
import { StatusPipe } from '../../../../Components/common/Pipes/status-pipe'
import { CompanyAdminUserManagementPaDetailsUserComponent } from './details/company-admin-user-management-pa-details-user.component'
import {TransferLocalService} from "../../../Transfers/Services/transfer-local.service";

@NgModule({
  declarations: [
    UserManagementPendingActionComponent,
    CompanyAdminUserManagementPaDetailsUserComponent,
  ],

  imports: [AppSharedModule, UserManagementRoutingModule, CommonModule],
  providers: [
    UserManagementGuard,
    UserManagementPendingActionService,
    StatusPipe,
      TransferLocalService
  ],
})
export class UserManagementModule {}
