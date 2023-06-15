import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { UserManagementPendingActionComponent } from './pendingactions/user-management-pending-action.component'

const routes: Routes = [
  {
    path: '',
    component: UserManagementPendingActionComponent,
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
