import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AuthGuardAddBeneficiary } from './AddBeneficiary/auth-guard-add-beneficiary.service'
import { AramcoPaymentsOptionsComponent } from './aramco-payments-options.component'
import { AuthGuardBeneficiaryList } from './BeneficiaryList/auth-guard-beneficiary-list.service'
import { AramcoPaymentsRoutingModule } from './module-routes'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'

@NgModule({
  declarations: [AramcoPaymentsOptionsComponent],
  imports: [CommonModule, AppSharedModule, AramcoPaymentsRoutingModule],
  providers: [
    AuthGuardRequestStatus,
    AuthGuardAddBeneficiary,
    AuthGuardBeneficiaryList,
  ],
  exports: [AramcoPaymentsOptionsComponent],
})
export class ModuleImpl {}
