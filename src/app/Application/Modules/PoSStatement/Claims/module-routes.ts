import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
//POS

import { AddClaimComponent } from './addClaims/add-claim.component'
import { ClaimCRMStatusComponent } from './claim-crm-status.component'
import { ClaimComponent } from './claim.component'
import { RequestDetailComponent } from './RequestStatus/detail/request-detail.component'
import { RequestReactivateComponent } from './RequestStatus/reactivate/request-reactivate.component'
import { RequestStatusComponent } from './RequestStatus/request-status.component'

export const routes: Routes = [
  { path: '', component: ClaimCRMStatusComponent },
  {
    path: 'request-status',
    component: RequestStatusComponent,
  },
  { path: 'add', component: ClaimComponent },
  { path: 'add-claim', component: AddClaimComponent },
  { path: 'details', component: RequestDetailComponent },
  { path: 'request-status/activate', component: RequestReactivateComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimRoutingModule {}
