import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ChartsModule } from 'ng2-charts'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AuthGuardFeedbackFile } from './FeedbackFiles/auth-guard-feedback-files.service'
import { InvoiceHubGuard } from './invoice-hub.guard'
import { AuthGuardInvoiceHistory } from './InvoiceHistory/auth-guard-invoice-history.service'
import { InvoiceHUBOptionsComponent } from './invoiceHUB-options.component'
import { InvoiceHUBRoutingModule } from './module-routes'
import { AuthGuardMultiPayment } from './MultiplePayment/auth-guard-multi-payment.service'
import { AuthGuardProcessedTransactionsInvoice } from './ProcessedTransactions/auth-guard-processed-transactions-Invoice.service'
import { AuthGuardReconciliation } from './Reconciliation/auth-guard-reconciliation.service'
import { AuthGuardMonthlyStatistics } from './Reports/auth-guard-monthly-statistics.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardSinglePayment } from './SinglePayment/auth-guard-single-payment.service'

@NgModule({
  declarations: [InvoiceHUBOptionsComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    InvoiceHUBRoutingModule,
  ],
  providers: [
    InvoiceHubGuard,
    AuthGuardRequestStatus,
    AuthGuardSinglePayment,
    AuthGuardFeedbackFile,
    AuthGuardMultiPayment,
    AuthGuardReconciliation,
    AuthGuardMonthlyStatistics,
    AuthGuardInvoiceHistory,
    AuthGuardProcessedTransactionsInvoice
  ],
  exports: [InvoiceHUBOptionsComponent],
})
export class ModuleImpl {}
