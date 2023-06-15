import { Routes } from '@angular/router/router'
import { FeedbackPaymentsComponent } from './Component/feedback-payments.component'
import { QuickTransferWidget } from './Component/home-quick-transfer.component'
import { RequestStatusTransferComponent } from './Component/request-status.component'
import { TransferGuard } from './Guard/transfer.guard'
import { TransfersFxRatesComponent } from './Component/fx-rates/transfers-fx-rates.component'
import { ProcessedTransactionsComponent } from './Component/processedtransactions/processed-transactions.component'
import { ProcessedTransactionsDetailComponent } from './Component/processedtransactions/details/processed-transactions-detail.component'
import { URPayGuard } from './Guard/uRPay.guard'
import { uRPayComponent } from './uRPay/uRPay.component'
import {RequestToPayGuard} from "../requestToPay/requestToPay.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'operation/',
    pathMatch: 'full',
  },
  {
    path: 'activate',
    data: ['activate'],
    canLoad: [TransferGuard],
    loadChildren: () =>
      import('./TransferReactivation/transfer-reactivation-module').then(
        (m) => m.TransferReactivationModule,
      ),
  },
  {
    path: 'localTransfer',
    canLoad: [TransferGuard],
    redirectTo: 'operation/localTransfer',
    pathMatch: 'full',
  },
  {
    path: 'owerTransfer',
    canLoad: [TransferGuard],
    redirectTo: 'operation/owerTransfer',
    pathMatch: 'full',
  },
  {
    path: 'rajhiTransfer',
    canLoad: [TransferGuard],
    redirectTo: 'operation/rajhiTransfer',
    pathMatch: 'full',
  },
  {
    path: 'internationalTransfer',
    canLoad: [TransferGuard],
    redirectTo: 'operation/internationalTransfer',
    pathMatch: 'full',
  },
  {
    path: 'operation/:operationType',
    canLoad: [TransferGuard],
    component: QuickTransferWidget,
  },
  {
    path: 'requestStatus',
    canLoad: [TransferGuard],
    component: RequestStatusTransferComponent,
  },
  {
    path: 'feedback',
    canLoad: [TransferGuard],
    component: FeedbackPaymentsComponent,
  },
  {
    path: 'fx-rates',
    canLoad: [TransferGuard],
    component: TransfersFxRatesComponent,
  },
  {
    path: 'processedTransactions',
    canLoad: [TransferGuard],
    component: ProcessedTransactionsComponent,
  },
  {
    path: 'processedTransactions/details',
    canLoad: [TransferGuard],
    component: ProcessedTransactionsDetailComponent,
  },
  {
    path: 'uRPay',
    canLoad: [URPayGuard],
    component: uRPayComponent,
  },
  {
    path: 'charity',
    loadChildren: () =>
        import('./charity-transfer/charity-transfer.module').then(
            (m) => m.CharityTransferModule,
        ),
  },
  {
    path: 'rtPay',
    data: ['rtPay'],
    canLoad: [RequestToPayGuard],
    loadChildren: () =>
        import('../requestToPay/requestToPay.module').then(
            (m) => m.RequestToPayModule,
        ),
  },
]
