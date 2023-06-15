import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardFeedbackFile } from './FeedbackFiles/auth-guard-feedback-files.service'
import { InvoiceHubGuard } from './invoice-hub.guard'
import { AuthGuardInvoiceHistory } from './InvoiceHistory/auth-guard-invoice-history.service'
import { InvoiceHUBOptionsComponent } from './invoiceHUB-options.component'
import { AuthGuardMultiPayment } from './MultiplePayment/auth-guard-multi-payment.service'
import { AuthGuardProcessedTransactionsInvoice } from './ProcessedTransactions/auth-guard-processed-transactions-Invoice.service'
import { AuthGuardReconciliation } from './Reconciliation/auth-guard-reconciliation.service'
import { AuthGuardMonthlyStatistics } from './Reports/auth-guard-monthly-statistics.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardSinglePayment } from './SinglePayment/auth-guard-single-payment.service'

export const routes: Routes = [
  {
    path: '',
    canActivate: [InvoiceHubGuard],
    component: InvoiceHUBOptionsComponent,
  },
  {
    path: 'single-payment',
    canLoad: [AuthGuardSinglePayment],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/SinglePayment/single-payment.module'
      ).then((m) => m.SinglePaymentModule),
  },
  {
    path: 'multi-payment',
    canLoad: [AuthGuardMultiPayment],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/MultiplePayment/multi-payment.module'
      ).then((m) => m.MultiPaymentModule),
  },
  {
    path: 'reconciliation',
    canLoad: [AuthGuardReconciliation],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/Reconciliation/reconciliation.module'
      ).then((m) => m.ReconciliationModule),
  },
  {
    path: 'monthlyStatistics',
    canLoad: [AuthGuardMonthlyStatistics],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/Reports/monthly-statistics.module'
      ).then((m) => m.MonthlyStatisticsModule),
  },
  {
    path: 'invoice-history',
    canLoad: [AuthGuardInvoiceHistory],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/InvoiceHistory/invoice-history.module'
      ).then((m) => m.InvoiceHistoryModule),
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/RequestStatus/request-status.module'
      ).then((m) => m.RequestStatusModule),
  },
  {
    path: 'feedback-files',
    canLoad: [AuthGuardFeedbackFile],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/FeedbackFiles/feedback-file.module'
      ).then((m) => m.FeedbackFileModule),
  },
  // PROCESSED TRANSACTIONS
  {
    path: 'processedTransactions',
    canLoad: [AuthGuardProcessedTransactionsInvoice],
    loadChildren: () =>
      import(
        'app/Application/Modules/InvoiceHUB/ProcessedTransactions/processed-transactions-Invoice.module'
      ).then((m) => m.ProcessedTransactionsInvoiceModule),
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceHUBRoutingModule {}
