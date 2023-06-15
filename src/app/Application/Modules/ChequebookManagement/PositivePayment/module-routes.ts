import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddPositivePayComponent } from './AddPositivePay/add-positive-pay.component'
import { HistoricalDataComponent } from './HistoricalData/historical-data.component'
import { PositivePaymentComponent } from './positive-payment.component'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { RequestStatusModule } from './RequestStatus/request-status.module'
import { SearchByChequeNumberComponent } from './searchByChequeNumber/search-cheque-number.component'
export const routes: Routes = [
  {
    path: '',
    component: PositivePaymentComponent,
  },
  {
    path: 'add-positive-payment',
    component: AddPositivePayComponent,
  },
  {
    path: 'historical-data',
    component: HistoricalDataComponent,
  },
  {
    path: 'search-cheque-number',
    component: SearchByChequeNumberComponent,
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import(
        'app/Application/Modules/ChequebookManagement/PositivePayment/RequestStatus/request-status.module'
      ).then((m) => m.RequestStatusModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
