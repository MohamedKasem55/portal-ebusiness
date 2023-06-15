import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChequebookManagementOptionsComponent } from './chequebook-management-options.component'
import { AuthGuardChequebookPayment } from './ChequebookPayment/auth-guard.service'
import { AuthGuardCreateChequebook } from './CreateChequebook/auth-guard.service'
import { AuthGuardPositivePayment } from './PositivePayment/auth-guard.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardStopPayment } from './stopPayment/auth-guard.service'
import { AuthGuardViewRequest } from './ViewRequest/auth-guard.service'

export const routes: Routes = [
  {
    path: '',
    component: ChequebookManagementOptionsComponent,
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
  {
    path: 'view-request',
    canLoad: [AuthGuardViewRequest],
    loadChildren: () =>
      import('./ViewRequest/module-module').then((m) => m.ViewRequestModule),
  },
  {
    path: 'stop-chequebook',
    canLoad: [AuthGuardStopPayment],
    loadChildren: () =>
      import('./stopPayment/stop-payment.module').then(
        (m) => m.StopPaymentModule,
      ),
  },
  {
    path: 'request-chequebook',
    canLoad: [AuthGuardCreateChequebook],
    loadChildren: () =>
      import('./CreateChequebook/module-module').then(
        (m) => m.CreateChequebookModule,
      ),
  },
  {
    path: 'chequebook-payment',
    canLoad: [AuthGuardChequebookPayment],
    loadChildren: () =>
      import('./ChequebookPayment/module-module').then(
        (m) => m.ChequebookPaymentModule,
      ),
  },
  {
    path: 'positive-payment',
    canLoad: [AuthGuardPositivePayment],
    loadChildren: () =>
      import('./PositivePayment/module-module').then(
        (m) => m.PositivePaymentModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChequebookManagementRoutingModule {}
