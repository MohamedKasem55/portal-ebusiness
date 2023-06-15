import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AramcoPaymentsOptionsComponent } from './aramco-payments-options.component'

import { AuthGuardAddBeneficiary } from './AddBeneficiary/auth-guard-add-beneficiary.service'
import { AuthGuardBeneficiaryList } from './BeneficiaryList/auth-guard-beneficiary-list.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'

export const routes: Routes = [
  {
    path: '',
    component: AramcoPaymentsOptionsComponent,
  },
  {
    path: 'add-beneficiary',
    canLoad: [AuthGuardAddBeneficiary],
    loadChildren: () =>
      import('../AramcoPayments/AddBeneficiary/add-beneficiary.module').then(
        (m) => m.AddBeneficiaryModule,
      ),
  },
  {
    path: 'beneficiaries',
    canLoad: [AuthGuardBeneficiaryList],
    loadChildren: () =>
      import('../AramcoPayments/BeneficiaryList/beneficiary-list.module').then(
        (m) => m.BeneficiaryListModule,
      ),
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('../AramcoPayments/RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AramcoPaymentsRoutingModule {}
