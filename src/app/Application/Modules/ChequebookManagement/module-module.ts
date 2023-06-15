import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { ChequebookManagementOptionsComponent } from './chequebook-management-options.component'
import { AuthGuardChequebookPayment } from './ChequebookPayment/auth-guard.service'
import { AuthGuardCreateChequebook } from './CreateChequebook/auth-guard.service'
import { ChequebookManagementRoutingModule } from './module-routes'
import { AuthGuardPositivePayment } from './PositivePayment/auth-guard.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardStopPayment } from './stopPayment/auth-guard.service'
import { AuthGuardViewRequest } from './ViewRequest/auth-guard.service'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [ChequebookManagementOptionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    ChequebookManagementRoutingModule,
  ],
  providers: [
    AuthGuardRequestStatus,
    AuthGuardViewRequest,
    AuthGuardCreateChequebook,
    AuthGuardChequebookPayment,
    AuthGuardPositivePayment,
    AuthGuardStopPayment,
  ],
  exports: [ChequebookManagementOptionsComponent],
})
export class ModuleImpl {}
