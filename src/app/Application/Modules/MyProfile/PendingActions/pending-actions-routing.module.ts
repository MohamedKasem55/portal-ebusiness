import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountWorkflowGuard } from './AccountWorkflow/account-workflow.guard'
import { AramcoBeneficiariesGuard } from './AramcoBeneficiaries/aramco-beneficiaries.guard'
import { AramcoPaymentsGuard } from './AramcoPayments/aramco-payments.guard'
import { BalanceCertificateGuard } from './BalanceCertificate/balance-certificate.guard'
import { BeneficiariesGuard } from './Beneficiaries/beneficiaries.guard'
import { BillPaymentsGuard } from './BillPayments/bill-payments.guard'
import { BulkPaymentGuard } from './BulkPayments/bulk-payment.guard'
import { ChequebookGuard } from './ChequebookManagement/chequebook.guard'
import { CommercialCardsGuard } from './CommercialCards/commercial-cards.guard'
import { GovernmentRevenueTransferPaymentsGuard } from './GovernmentRevenueTransferPayments/government-revenue-transfer-payments.guard'
import { HajjUmrahGuard } from './HajjUmrahCards/Hajj-umrah.guard'
import { InvoiceHubGuard } from './InvoiceHUB/invoice-hub.guard'
import { MoiPaymentsGuard } from './MoiPayments/moi-payments.guard'
import { PayrollCardsGuard } from './PayrollCards/payroll-cards.guard'
import { PayrollsGuard } from './Payrolls/payrolls.guard'
import { PosStatementGuard } from './POSStatment/pos-statement.guard'
import { PrepaidCardsGuard } from './PrepaidCards/prepaid-cards.guard'
import { RequestStatusGuard } from './RequestStatus/request-status.guard'
import { StandingOrdersGuard } from './StandingOrders/standing-orders.guard'
import { TransfersGuard } from './Transfers/transfers.guard'
import { PayrollswpsGuard } from './WPSPayrolls/payrollswps.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'requeststatus',
    pathMatch: 'full',
  },
  {
    path: 'requeststatus',
    canLoad: [RequestStatusGuard],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
  {
    path: 'transfers',
    canLoad: [TransfersGuard],
    loadChildren: () =>
      import('./Transfers/transfers.module').then((m) => m.TransfersModule),
  },
  {
    path: 'bill-payments',
    canLoad: [BillPaymentsGuard],
    loadChildren: () =>
      import('./BillPayments/bill-payments.module').then(
        (m) => m.BillPaymentsModule,
      ),
  },
  {
    path: 'bulkpayments',
    canLoad: [BulkPaymentGuard],
    loadChildren: () =>
      import('./BulkPayments/bulk-payments.module').then(
        (m) => m.BulkPaymentsModule,
      ),
  },
  {
    path: 'invoiceHUB',
    canLoad: [InvoiceHubGuard],
    loadChildren: () =>
      import('./InvoiceHUB/invoiceHUB.module').then((m) => m.InvoiceHUBModule),
  },
  {
    path: 'beneficiaries',
    canLoad: [BeneficiariesGuard],
    loadChildren: () =>
      import('./Beneficiaries/beneficiaries.module').then(
        (m) => m.BeneficiariesModule,
      ),
  },
  {
    path: 'soft-token',
  //  canLoad: [NewSoftTokenGuard], CAMBIAR
    loadChildren: () =>
      import('./NewSoftToken/new-soft-token.module').then(
        (m) => m.NewSoftTokenModule,
      ),
  },
  {
    path: 'standing-orders',
    canLoad: [StandingOrdersGuard],
    loadChildren: () =>
      import('./StandingOrders/standing-orders.module').then(
        (m) => m.StandingOrdersModule,
      ),
  },
  {
    path: 'direct-debits',
    loadChildren: () =>
      import('./DirectDebits/direct-debits.module').then(
        (m) => m.DirectDebitsModule,
      ),
  },
  {
    path: 'moi-payments',
    canLoad: [MoiPaymentsGuard],
    loadChildren: () =>
      import('./MoiPayments/moi-payments.module').then(
        (m) => m.MoiPaymentsModule,
      ),
  },
  {
    path: 'aramco-beneficiaries',
    canLoad: [AramcoBeneficiariesGuard],
    loadChildren: () =>
      import('./AramcoBeneficiaries/beneficiaries.module').then(
        (m) => m.BeneficiariesModule,
      ),
  },
  {
    path: 'Hajj-Umrah',
    canLoad: [HajjUmrahGuard],
    loadChildren: () =>
      import('./HajjUmrahCards/Hajj-Umrah.module').then(
        (m) => m.HajjUmrahModule,
      ),
  },
  {
    path: 'aramco-payments',
    canLoad: [AramcoPaymentsGuard],
    loadChildren: () =>
      import('./AramcoPayments/payments.module').then((m) => m.PaymentsModule),
  },
  {
    path: 'payroll',
    canLoad: [PayrollsGuard],
    loadChildren: () =>
      import('./Payrolls/payrolls.module').then((m) => m.PayrollsModule),
  },
  {
    path: 'payroll-cards',
    canLoad: [PayrollCardsGuard],
    loadChildren: () =>
      import('./PayrollCards/payroll-cards.module').then(
        (m) => m.PayrollCardsModule,
      ),
  },
  {
    path: 'wpspayrolls',
    canLoad: [PayrollswpsGuard],
    loadChildren: () =>
      import('./WPSPayrolls/payrolls.module').then((m) => m.WPSPayrollsModule),
  },
  {
    path: 'pos-statement',
    canLoad: [PosStatementGuard],
    loadChildren: () =>
      import('./POSStatment/pos-statement.module').then(
        (m) => m.POSStatementModule,
      ),
  },
  {
    path: 'chequebook',
    canLoad: [ChequebookGuard],
    loadChildren: () =>
      import('./ChequebookManagement/chequebook.module').then(
        (m) => m.ChequebookModule,
      ),
  },
  {
    path: 'balance-certificate',
    canLoad: [BalanceCertificateGuard],
    loadChildren: () =>
      import('./BalanceCertificate/balance-certificate.module').then(
        (m) => m.BalanceCertificateModule,
      ),
  },
  {
    path: 'government-revenue-transfer-payments',
    canLoad: [GovernmentRevenueTransferPaymentsGuard],
    loadChildren: () =>
      import(
        './GovernmentRevenueTransferPayments/government-revenue-transfer-payments.module'
      ).then((m) => m.GovernmentRevenueTransferPaymentsModule),
  },
  {
    path: 'account-workflow',
    canLoad: [AccountWorkflowGuard],
    loadChildren: () =>
      import('./AccountWorkflow/account-workflow.module').then(
        (m) => m.AccountWorkflowModule,
      ),
  },
  {
    path: 'user-management',
    //canLoad: [UserManagementGuard],
    loadChildren: () =>
      import('./UserManagement/user-management.module').then(
        (m) => m.UserManagementModule,
      ),
  },
  {
    path: 'commercialcards',
    canLoad: [CommercialCardsGuard],
    loadChildren: () =>
      import('./CommercialCards/commercial-cards.module').then(
        (m) => m.CommercialCardsModule,
      ),
  },
  {
    path: 'prepaidCards',
    canLoad: [PrepaidCardsGuard],
    loadChildren: () =>
      import('./PrepaidCards/prepaid-cards.module').then(
        (m) => m.PrepaidCardsModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingActionsRoutingModule {}
