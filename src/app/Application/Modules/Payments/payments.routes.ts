import { Routes } from '@angular/router'
import { AddBillComponent } from './bill/add-bill/add-bill.component'
import { BillPaymentsComponent } from './bill/bill-payments/bill-payments.component'
import { MonthlyStatisticsComponent } from './bill/monthly-statistics/monthly-statistics.component'
import { RequestBillComponent } from './bill/request-bill/request-bill.component'
import { RequestBillReactivateComponent } from './Component/reactivate/request-reactivate.component'
import { RequestBillReactivateBillComponent } from './Component/reactivateBill/request-reactivate.component'
import { AddStandingOrderComponent } from './Component/standing-orders/add-standing.order.component'
import { EditStandingOrderComponent } from './Component/standing-orders/edit-standingOrder.component'
import { ListStandindOrdersComponent } from './Component/standing-orders/list-standind-orders/list-standind-orders.component'
import { RequestReactivateComponent } from './Component/standing-orders/reactivate/request-reactivate.component'
import { RequestStatusComponent } from './Component/standing-orders/request-status.component'
import { FeedBackFilesDetailComponent } from './FeedBackFiles/feedback-files-details.component'
import { FeedBackFilesComponent } from './FeedBackFiles/feedback-files.component'
import { AddStandingOrdersGuard } from './Guard/add-standing-orders.guard'
import { BillPaymentAddGuard } from './Guard/bill-payment-add.guard'
import { BillPaymentFeedbackGuard } from './Guard/bill-payment-feedback.guard'
import { BillPaymentRequestStatusGuard } from './Guard/bill-payment-request-status.guard'
import { BillPaymentStatisticGuard } from './Guard/bill-payment-statistic.guard'
import { BillPaymentGuard } from './Guard/bill-payment.guard'
import { RequestStatusStandingOrdersGuard } from './Guard/request-status-standing-orders.guard'
import { StandingOrdersGuard } from './Guard/standing-orders.guard'
import { FeedbackFilesGuard as FeedbackFilesGuardMOI } from './MOI/Guard/feedback-files.guard'
import { RequestStatusGuard as RequestStatusGuardMOI } from './MOI/Guard/request-status.guard'
import { MOIComponent } from './MOI/moi.component'
import { MoiPaymentComponent } from './MOI/Payment/moi-payment.component'
import { MoiPaymentsGuard } from './MOI/Payment/moi-payments.guard'
import { MoiProcessedTransactionsDetailComponent } from './MOI/ProcessedTransactions/details/moi-processed-transactions-detail.component'
import { MoiProcessedTransactionsComponent } from './MOI/ProcessedTransactions/list/moi-processed-transactions.component'
import { MoiRefundComponent } from './MOI/Refund/moi-refund.component'
import { MoiRefundsGuard } from './MOI/Refund/moi-refunds.guard'
import {BulkBillPaymentsComponent} from "./bill/bulk-bill-payments/bulk-bill-payments.component";
import {SingleBillPaymentsComponent} from "./bill/singel-bill-payments/single-bill-payments.component";
import {BulkPaymentsComponent} from "./MOI/bulk-payments/bulk-payments.component";
import {MoiBulkPaymentGuard} from "./MOI/Guard/moi-bulk-payment.guard";

export const routes: Routes = [
  // ******************************** PAYMENTS **************************************************************

  // MOI PAYMENTS
  {
    path: 'moi',
    children: [
      {
        path: '',
        component: MOIComponent,
      },
      {
        path: 'payments',
        canLoad: [MoiPaymentsGuard],
        component: MoiPaymentComponent,
      },
      {
        path: 'bulk-payments',
        canActivate :[MoiBulkPaymentGuard],
        canLoad: [MoiBulkPaymentGuard],
        component: BulkPaymentsComponent,
      },
      {
        path: 'refunds',
        canLoad: [MoiRefundsGuard],
        component: MoiRefundComponent,
      },
      // REQUEST STATUS
      {
        path: 'request-status',
        canLoad: [RequestStatusGuardMOI],
        loadChildren: () =>
          import('./MOI/RequestStatus/request-status.module').then(
            (m) => m.RequestStatusModule,
          ),
      },
      // FEEDBACK FILES
      {
        path: 'feedback-files',
        canLoad: [FeedbackFilesGuardMOI],
        loadChildren: () =>
          import('./MOI/FeedBackFiles/feedback-files.module').then(
            (m) => m.FeedBackFilesModule,
          ),
      },
      {
        path: 'processedTransactions',
        component: MoiProcessedTransactionsComponent,
      },
      {
        path: 'processedTransactionsDetail',
        component: MoiProcessedTransactionsDetailComponent,
      },
    ],
  },

  // ******************************** END PAYMENTS **************************************************************

  //-------------------------------------------------------------------------------
  {
    path: 'oneTimePayment/bulk',
    canActivate: [BillPaymentGuard],
    canLoad: [BillPaymentGuard],
    component: BulkBillPaymentsComponent,
  },
  {
    path: 'oneTimePayment/single',
    canActivate: [BillPaymentGuard],
    canLoad: [BillPaymentGuard],
    component: SingleBillPaymentsComponent,
  },
  {
    path: 'billPayments',
    canActivate: [BillPaymentGuard],
    canLoad: [BillPaymentGuard],
    component: BillPaymentsComponent,
  },
  {
    path: 'billPayments/addBill',
    canLoad: [BillPaymentAddGuard],
    component: AddBillComponent,
  },
  {
    path: 'billPayments/request',
    canLoad: [BillPaymentRequestStatusGuard],
    component: RequestBillComponent,
  },
  {
    path: 'billPayments/request/activate',
    canLoad: [BillPaymentRequestStatusGuard],
    component: RequestBillReactivateComponent,
  },
  {
    path: 'billPayments/request/activate-bill',
    canLoad: [BillPaymentRequestStatusGuard],
    component: RequestBillReactivateBillComponent,
  },
  {
    path: 'billPayments/statistics',
    canLoad: [BillPaymentStatisticGuard],
    component: MonthlyStatisticsComponent,
  },
  {
    path: 'billPayments/feedbackfiles',
    canLoad: [BillPaymentFeedbackGuard],
    component: FeedBackFilesComponent,
  },
  {
    path: 'billPayments/feedbackfiles-details',
    canLoad: [BillPaymentFeedbackGuard],
    component: FeedBackFilesDetailComponent,
  },
  {
    path: 'billPayments/processedTransactions',
    loadChildren: () =>
      import('./bill/ProcessedTransactions/processed-transactions-bill.module').then(
        (m) => m.ProcessedTransactionsBillModule,
      ),
  },

  //Standing ORders
  {
    path: 'stadingOrders',
    canLoad: [StandingOrdersGuard],
    component: ListStandindOrdersComponent,
  },
  {
    path: 'stadingOrders/add',
    canLoad: [AddStandingOrdersGuard],
    component: AddStandingOrderComponent,
  },
  {
    path: 'stadingOrders/add/:account',
    canLoad: [AddStandingOrdersGuard],
    component: AddStandingOrderComponent,
  },
  {
    path: 'stadingOrders/edit',
    canLoad: [AddStandingOrdersGuard],
    component: EditStandingOrderComponent,
  },
  {
    path: 'stadingOrders/requestStatus',
    canLoad: [RequestStatusStandingOrdersGuard],
    component: RequestStatusComponent,
  },
  {
    path: 'stadingOrders/requestStatus/activate',
    canLoad: [RequestStatusStandingOrdersGuard],
    component: RequestReactivateComponent,
  },
]
