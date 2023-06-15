import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddPayerComponent } from './AddPayer/add-payer.component'
import { AuthGuardManagePayer } from './auth-guard-manage-payer.service'
import { DeletePayerComponent } from './DeletePayer/delete-payer.component'
import { ManagePayerComponent } from './manage-payer.component'
import { ModifyPayerComponent } from './ModifyPayer/modify-payer.component'

const routes: Routes = [
  {
    path: '',
    component: ManagePayerComponent,
  },
  {
    path: 'addPayer',
    canActivate: [AuthGuardManagePayer],
    component: AddPayerComponent,
  },
  {
    path: 'deletePayer',
    canActivate: [AuthGuardManagePayer],
    component: DeletePayerComponent,
  },
  {
    path: 'modifyPayer',
    canActivate: [AuthGuardManagePayer],
    component: ModifyPayerComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePayerRoutingModule {}
