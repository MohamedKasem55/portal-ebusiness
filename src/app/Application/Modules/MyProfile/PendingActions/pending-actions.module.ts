import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { SharedModule } from '../../shared/shared.module'
import { AccountWorkflowGuard } from './AccountWorkflow/account-workflow.guard'
import { AramcoBeneficiariesGuard } from './AramcoBeneficiaries/aramco-beneficiaries.guard'
import { AramcoPaymentsGuard } from './AramcoPayments/aramco-payments.guard'
import { BalanceCertificateGuard } from './BalanceCertificate/balance-certificate.guard'
import { BeneficiariesGuard } from './Beneficiaries/beneficiaries.guard'
import { BillPaymentsGuard } from './BillPayments/bill-payments.guard'
import { ChequebookGuard } from './ChequebookManagement/chequebook.guard'
import { WorkflowDetailTableComponent } from './Component/workflow-detail-table/workflow-detail-table.component'
import { WorkflowDetailsPopupComponent } from './Component/workflow-details-popup/workflow-details-popup.component'
import { GovernmentRevenueTransferPaymentsGuard } from './GovernmentRevenueTransferPayments/government-revenue-transfer-payments.guard'
import { HajjUmrahGuard } from './HajjUmrahCards/Hajj-umrah.guard'
import { InvoiceHubGuard } from './InvoiceHUB/invoice-hub.guard'
import { MoiPaymentsGuard } from './MoiPayments/moi-payments.guard'
import { PayrollCardsGuard } from './PayrollCards/payroll-cards.guard'
import { PayrollsGuard } from './Payrolls/payrolls.guard'
import { PendingActionsRoutingModule } from './pending-actions-routing.module'
import { PosStatementGuard } from './POSStatment/pos-statement.guard'
import { RequestStatusGuard } from './RequestStatus/request-status.guard'
import { StandingOrdersGuard } from './StandingOrders/standing-orders.guard'
import { TransfersGuard } from './Transfers/transfers.guard'
import { PayrollswpsGuard } from './WPSPayrolls/payrollswps.guard'

@NgModule({
  imports: [AppSharedModule, SharedModule, PendingActionsRoutingModule],
  declarations: [WorkflowDetailsPopupComponent, WorkflowDetailTableComponent],
  providers: [
    RequestStatusGuard,
    TransfersGuard,
    BillPaymentsGuard,
    BeneficiariesGuard,
    StandingOrdersGuard,
    MoiPaymentsGuard,
    PayrollCardsGuard,
    PayrollsGuard,
    PayrollswpsGuard,
    InvoiceHubGuard,
    BalanceCertificateGuard,
    PosStatementGuard,
    AramcoBeneficiariesGuard,
    AramcoPaymentsGuard,
    ChequebookGuard,
    GovernmentRevenueTransferPaymentsGuard,
    AccountWorkflowGuard,
    HajjUmrahGuard
  ],
  exports: [WorkflowDetailsPopupComponent],
})
export class PendingActionsModule {}
