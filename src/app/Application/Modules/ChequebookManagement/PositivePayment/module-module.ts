import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AddPositivePayStep1Component } from './AddPositivePay/add-positive-pay-step1.component'
import { AddPositivePayStep2Component } from './AddPositivePay/add-positive-pay-step2.component'
import { AddPositivePayStep3Component } from './AddPositivePay/add-positive-pay-step3.component'
import { AddPositivePayComponent } from './AddPositivePay/add-positive-pay.component'
import { AddPositivePayService } from './AddPositivePay/add-positive-pay.service'
import { AuthGuardPositivePayment } from './auth-guard.service'
import { DetailsPositivePayStep1Component } from './HistoricalData/details-positive-pay-step1.component'
import { DetailsPositivePayStep2Component } from './HistoricalData/details-positive-pay-step2.component'
import { DetailsPositivePayStep3Component } from './HistoricalData/details-positive-pay-step3.component'
import { HistoricalDataComponent } from './HistoricalData/historical-data.component'
import { HistoricalDataService } from './HistoricalData/historical-data.service'
import { RoutingModule } from './module-routes'
import { PositivePaymentComponent } from './positive-payment.component'
import { PositivePaymentService } from './positive-payment.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { SearchByChequeNumberStep1Component } from './searchByChequeNumber/search-cheque-number-step1.component'
import { SearchByChequeNumberStep2Component } from './searchByChequeNumber/search-cheque-number-step2.component'
import { SearchByChequeNumberStep3Component } from './searchByChequeNumber/search-cheque-number-step3.component'
import { SearchByChequeNumberComponent } from './searchByChequeNumber/search-cheque-number.component'
import { SearchByChequeNumberService } from './searchByChequeNumber/search-cheque-number.service'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    PositivePaymentComponent,
    AddPositivePayComponent,
    AddPositivePayStep1Component,
    AddPositivePayStep2Component,
    AddPositivePayStep3Component,
    HistoricalDataComponent,
    DetailsPositivePayStep1Component,
    DetailsPositivePayStep2Component,
    DetailsPositivePayStep3Component,
    SearchByChequeNumberComponent,
    SearchByChequeNumberStep1Component,
    SearchByChequeNumberStep2Component,
    SearchByChequeNumberStep3Component,
  ],
  imports: [CommonModule, SharedModule, AppSharedModule, RoutingModule],
  providers: [
    AuthGuardPositivePayment,
    AuthGuardRequestStatus,
    PositivePaymentService,
    AddPositivePayService,
    HistoricalDataService,
    SearchByChequeNumberService,
  ],
  exports: [
    PositivePaymentComponent,
    AddPositivePayComponent,
    AddPositivePayStep1Component,
    AddPositivePayStep2Component,
    AddPositivePayStep3Component,
    SearchByChequeNumberComponent,
    SearchByChequeNumberStep1Component,
    SearchByChequeNumberStep2Component,
    SearchByChequeNumberStep3Component,
    HistoricalDataComponent,
    DetailsPositivePayStep1Component,
    DetailsPositivePayStep2Component,
    DetailsPositivePayStep3Component,
  ],
})
export class PositivePaymentModule {}
