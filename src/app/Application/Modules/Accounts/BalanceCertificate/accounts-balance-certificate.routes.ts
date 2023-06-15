import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountsBalanceCertificateRequestComponent } from './RequestNewCertificate/accounts-balance-certificate-request.component'
import { RequestReactivateComponent } from './RequestStatus/reactivate/request-reactivate.component'
import { RequestStatusComponent } from './RequestStatus/request-status.component'
import { AccountsBalanceCertificateComponent } from './accounts-balance-certificate.component'

const routes: Routes = [
  {
    path: '',
    component: AccountsBalanceCertificateComponent,
  },

  {
    path: 'request',
    component: AccountsBalanceCertificateRequestComponent,
  },
  {
    path: 'request-status',
    component: RequestStatusComponent,
  },
  {
    path: 'request-status/activate',
    component: RequestReactivateComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountBalanceRoutingModule {}
