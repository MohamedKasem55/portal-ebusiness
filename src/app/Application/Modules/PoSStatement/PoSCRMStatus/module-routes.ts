import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
//POS

import { DetailRequestComponent } from './Details/detail-request.component'
import { ManageRequestComponent } from './manage-request.component'

import { AuthGuardRequestCRMStatus } from './auth-guard-request-status.service'

export const routes: Routes = [
  { path: '', component: ManageRequestComponent },
  {
    path: 'detail',
    canActivate: [AuthGuardRequestCRMStatus],
    component: DetailRequestComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoSCRMStatusRoutingModule {}
