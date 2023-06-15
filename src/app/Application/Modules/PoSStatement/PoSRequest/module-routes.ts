import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
//POS

import { AddRequestComponent } from './AddPoSRequest/add-request.component'
import { DetailRequestComponent } from './DetailPoSRequest/detail-request.component'

import { RequestReactivateComponent } from './RequestStatus/reactivate/request-reactivate.component'
import { RequestStatusComponent } from './RequestStatus/request-status.component'

import { AuthGuardManageRequest } from './auth-guard-manage-request.service'

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardManageRequest],
    component: AddRequestComponent,
  },
  {
    path: 'detail',
    canActivate: [AuthGuardManageRequest],
    component: DetailRequestComponent,
  },
  {
    path: 'add',
    canActivate: [AuthGuardManageRequest],
    component: AddRequestComponent,
  },
  {
    path: 'request-status',
    component: RequestStatusComponent,
  },
  { path: 'request-status/activate', component: RequestReactivateComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoSRequestRoutingModule {}
