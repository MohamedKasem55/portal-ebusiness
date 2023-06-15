import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
//POS

import { RequestStatusComponent } from './request-status.component'

import { AuthGuardRequesStatus } from './auth-guard-request-status.service'

import { RequestReactivateComponent as RequestReactivateClaimComponent } from './reactivate-claims/request-reactivate.component'
import { RequestReactivateComponent as RequestReactivateMaintenanceComponent } from './reactivate-maintenance/request-reactivate.component'
import { RequestReactivateComponent as RequestReactivateManagementComponent } from './reactivate-management/request-reactivate.component'
import { RequestReactivateComponent as RequestReactivateRequestComponent } from './reactivate-request/request-reactivate.component'

export const routes: Routes = [
  { path: '', component: RequestStatusComponent },
  {
    path: 'reactivate-request',
    canActivate: [AuthGuardRequesStatus],
    component: RequestReactivateRequestComponent,
  },
  {
    path: 'reactivate-maintenance',
    canActivate: [AuthGuardRequesStatus],
    component: RequestReactivateMaintenanceComponent,
  },
  {
    path: 'reactivate-management',
    canActivate: [AuthGuardRequesStatus],
    component: RequestReactivateManagementComponent,
  },
  {
    path: 'reactivate-claim',
    canActivate: [AuthGuardRequesStatus],
    component: RequestReactivateClaimComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoSRequestStatusRoutingModule {}
