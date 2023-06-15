import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ChartsModule } from 'ng2-charts'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AccountBalanceService } from '../Home/Services/account-balance-service'
import { AddBillComponent } from './bill/add-bill/add-bill.component'
import { BillPaymentService } from './bill/bill-payments/bill-payment.service'
import { BillPaymentsComponent } from './bill/bill-payments/bill-payments.component'
import { FeedbackBillService } from './bill/feedback-bill/bill.feedback.service'
import { FeedbackBillComponent } from './bill/feedback-bill/feedback-payments.component'
import { MonthlyStatisticsComponent } from './bill/monthly-statistics/monthly-statistics.component'
import { MonthlyStatisticsService } from './bill/monthly-statistics/monthly-statistics.service'
import { RequestBillService } from './bill/request-bill/bill.request.service'
import { RequestBillComponent } from './bill/request-bill/request-bill.component'
import { BarChartComponent } from './Component/componentsGraffic/bar-chart/bar-chart.component'
import { DonatComponent } from './Component/componentsGraffic/donat/donat.component'
import { MonthSelectComponent } from './Component/componentsGraffic/select-Month'
import { GraficoService } from './Component/grafico.service'
import { GraficosComponent } from './Component/graficos/graficos.component'
import { RequestBillReactivateStep1Component } from './Component/reactivate/request-reactivate-step1.component'
import { RequestBillReactivateStep2Component } from './Component/reactivate/request-reactivate-step2.component'
import { RequestBillReactivateStep3Component } from './Component/reactivate/request-reactivate-step3.component'
import { RequestBillReactivateComponent } from './Component/reactivate/request-reactivate.component'
import { RequestBillReactivateService } from './Component/reactivate/request-reactivate.service'
import { RequestBillReactivateBillStep1Component } from './Component/reactivateBill/request-reactivate-step1.component'
import { RequestBillReactivateBillStep2Component } from './Component/reactivateBill/request-reactivate-step2.component'
import { RequestBillReactivateBillStep3Component } from './Component/reactivateBill/request-reactivate-step3.component'
import { RequestBillReactivateBillComponent } from './Component/reactivateBill/request-reactivate.component'
import { RequestBillReactivateBillService } from './Component/reactivateBill/request-reactivate.service'
import { AddStandingOrderComponent } from './Component/standing-orders/add-standing.order.component'
import { EditStandingOrderComponent } from './Component/standing-orders/edit-standingOrder.component'
import { ListStandindOrdersComponent } from './Component/standing-orders/list-standind-orders/list-standind-orders.component'
import { RequestReactivateStep1Component } from './Component/standing-orders/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './Component/standing-orders/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './Component/standing-orders/reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './Component/standing-orders/reactivate/request-reactivate.component'
import { RequestReactivateService } from './Component/standing-orders/reactivate/request-reactivate.service'
import { RequestStatusComponent } from './Component/standing-orders/request-status.component'
import { Step1Component as FeedBackFilesStep1Component } from './FeedBackFiles/detailSteps/step1/step1.component'
import { Step2Component as FeedBackFilesStep2Component } from './FeedBackFiles/detailSteps/step2/step2.component'
import { Step3Component as FeedBackFilesStep3Component } from './FeedBackFiles/detailSteps/step3/step3.component'
import { FeedBackFilesDetailComponent } from './FeedBackFiles/feedback-files-details.component'
import { FeedBackFilesService } from './FeedBackFiles/feedback-files-list.service'
import { FeedBackFilesComponent } from './FeedBackFiles/feedback-files.component'
import { AddStandingOrdersGuard } from './Guard/add-standing-orders.guard'
import { BillPaymentAddGuard } from './Guard/bill-payment-add.guard'
import { BillPaymentFeedbackGuard } from './Guard/bill-payment-feedback.guard'
import { BillPaymentRequestStatusGuard } from './Guard/bill-payment-request-status.guard'
import { BillPaymentStatisticGuard } from './Guard/bill-payment-statistic.guard'
import { BillPaymentGuard } from './Guard/bill-payment.guard'
import { RequestStatusStandingOrdersGuard } from './Guard/request-status-standing-orders.guard'
import { StandingOrdersGuard } from './Guard/standing-orders.guard'
import { MoiPaymentRefundBatchListComponent } from './MOI/Common/moi-payment-refund-batch-list.component'
import { FeedbackFilesGuard as FeedbackFilesGuardMOI } from './MOI/Guard/feedback-files.guard'
import { OptionsGuard as OptionsGuardMOI } from './MOI/Guard/options.guard'
import { RequestStatusGuard as RequestStatusGuardMOI } from './MOI/Guard/request-status.guard'
import { MOIComponent } from './MOI/moi.component'
import { MoiPaymentComponent } from './MOI/Payment/moi-payment.component'
import { MoiPaymentService } from './MOI/Payment/moi-payment.service'
import { MoiPaymentsGuard } from './MOI/Payment/moi-payments.guard'
import { MoiPaymentFormComponent } from './MOI/Payment/Steps/Common/moi-payment-form.component'
import { MoiPaymentStep1Component } from './MOI/Payment/Steps/Step1/moi-payment-step1.component'
import { MoiPaymentStep2Component } from './MOI/Payment/Steps/Step2/moi-payment-step2.component'
import { MoiPaymentStep3Component } from './MOI/Payment/Steps/Step3/moi-payment-step3.component'
import { MoiRefundComponent } from './MOI/Refund/moi-refund.component'
import { MoiRefundService } from './MOI/Refund/moi-refund.service'
import { MoiRefundsGuard } from './MOI/Refund/moi-refunds.guard'
import { MoiRefundFormComponent } from './MOI/Refund/Steps/Common/moi-refund-form.component'
import { MoiRefundStep1Component } from './MOI/Refund/Steps/Step1/moi-refund-step1.component'
import { MoiRefundStep2Component } from './MOI/Refund/Steps/Step2/moi-refund-step2.component'
import { MoiRefundStep3Component } from './MOI/Refund/Steps/Step3/moi-refund-step3.component'
import { FormDataService } from './MOI/Services/shared-form-data.service'
import { routes } from './payments.routes'
import { AccountsMOIService } from './Services/accounts-moi.service'
import { MoiStaticComboDataService } from './Services/moi.static.combo-data.service'
import { StadingOrdersService } from './Services/standingOrder.services'
import { MoiPaymentConfirmationTableComponent } from './MOI/Payment/Steps/Common/moi-payment-confirmation-table.component'
import { MoiProcessedTransactionsService } from './MOI/ProcessedTransactions/list/moi-processed-transactions.service'
import { MoiProcessedTransactionsDetailService } from './MOI/ProcessedTransactions/details/moi-processed-transactions-detail.service'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { MoiProcessedTransactionsComponent } from './MOI/ProcessedTransactions/list/moi-processed-transactions.component'
import { MoiProcessedTransactionsDetailComponent } from './MOI/ProcessedTransactions/details/moi-processed-transactions-detail.component'
import { SharedModule } from '../shared/shared.module';
import { MoiPaymentStep2TrafficViolationDetailsComponent } from './MOI/Payment/Steps/Step2/moi-payment-step2-traffic-violation-details/moi-payment-step2-traffic-violation-details.component'
import { MoiPaymentStep2TrafficViolationDetailsService } from "./MOI/Payment/Steps/Step2/moi-payment-step2-traffic-violation-details/moi-payment-step2-traffic-violation-details.service";
import {CurrentAccountsModule} from "../Accounts/accounts-current-account/accounts-current.modules";
import {BulkBillPaymentsComponent} from "./bill/bulk-bill-payments/bulk-bill-payments.component";
import {SingleBillPaymentsComponent} from "./bill/singel-bill-payments/single-bill-payments.component";
import {BillDetailsPaymentsComponent} from "./bill/bill-details/bill-detail.component";
import {BulkPaymentsComponent} from "./MOI/bulk-payments/bulk-payments.component";
import {CurrentAccountsService} from "../Accounts/accounts-current-account/accounts-current-account.service";
import {BulkPaymentsService} from "./MOI/bulk-payments/bulk-payments.service";
import {BulkErrorComponent} from "./MOI/bulk-payments/bulk-error/bulk-error.component";
import {BulkPaymentsListComponent} from "./MOI/bulk-payments/bulk-payment-list/bulk-payments-list.component";
import {MoiBulkPaymentGuard} from "./MOI/Guard/moi-bulk-payment.guard";

@NgModule({
  declarations: [
    BillPaymentsComponent,
    AddBillComponent,
    RequestBillComponent,
    FeedbackBillComponent,
    MonthlyStatisticsComponent,
    GraficosComponent,
    ListStandindOrdersComponent,
    AddStandingOrderComponent,
    EditStandingOrderComponent,
    MonthSelectComponent,
    BarChartComponent,
    DonatComponent,
    RequestStatusComponent,
    FeedBackFilesComponent,
    FeedBackFilesDetailComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
    RequestBillReactivateComponent,
    RequestBillReactivateStep1Component,
    RequestBillReactivateStep2Component,
    RequestBillReactivateStep3Component,
    RequestBillReactivateBillComponent,
    RequestBillReactivateBillStep1Component,
    RequestBillReactivateBillStep2Component,
    RequestBillReactivateBillStep3Component,
    MoiPaymentRefundBatchListComponent,
    MoiPaymentComponent,
    MoiPaymentFormComponent,
    MoiPaymentStep1Component,
    MoiPaymentStep2Component,
    MoiPaymentStep3Component,
    MoiRefundComponent,
    MoiRefundFormComponent,
    MoiRefundStep1Component,
    MoiRefundStep2Component,
    MoiRefundStep3Component,
    MOIComponent,
    FeedBackFilesStep1Component,
    FeedBackFilesStep2Component,
    FeedBackFilesStep3Component,
    MoiPaymentConfirmationTableComponent,
    MoiProcessedTransactionsComponent,
    MoiProcessedTransactionsDetailComponent,
    MoiPaymentStep2TrafficViolationDetailsComponent,
    BulkBillPaymentsComponent,
    SingleBillPaymentsComponent,
    BillDetailsPaymentsComponent,
    MoiPaymentStep2TrafficViolationDetailsComponent,
    BulkPaymentsComponent,
    BulkErrorComponent,
    BulkPaymentsListComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    SharedModule,
    CurrentAccountsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [
    RequestStatusGuardMOI,
    OptionsGuardMOI,
    FeedbackFilesGuardMOI,
    BillPaymentService,
    RequestBillService,
    FeedbackBillService,
    MonthlyStatisticsService,
    GraficoService,
    FormDataService,
    AccountsMOIService,
    MoiStaticComboDataService,
    StadingOrdersService,
    AccountBalanceService,
    FeedBackFilesService,
    RequestReactivateService,
    RequestBillReactivateService,
    StandingOrdersGuard,
    AddStandingOrdersGuard,
    RequestStatusStandingOrdersGuard,
    BillPaymentGuard,
    BillPaymentAddGuard,
    BillPaymentFeedbackGuard,
    BillPaymentStatisticGuard,
    BillPaymentRequestStatusGuard,
    RequestBillReactivateBillService,
    MoiPaymentsGuard,
    MoiRefundsGuard,
    MoiPaymentService,
    MoiRefundService,
    MoiProcessedTransactionsService,
    MoiProcessedTransactionsDetailService,
    ModelPipe,
    MoiPaymentStep2TrafficViolationDetailsService,
    CurrentAccountsService,
    BulkPaymentsService,
    MoiBulkPaymentGuard,
  ],
  exports: [
    BillPaymentsComponent,
    AddBillComponent,
    FeedbackBillComponent,
    RequestBillComponent,
    ListStandindOrdersComponent,
    AddStandingOrderComponent,
    EditStandingOrderComponent,
    RequestStatusComponent,
    FeedBackFilesComponent,
    FeedBackFilesDetailComponent,
    MoiPaymentRefundBatchListComponent,
    MoiPaymentComponent,
    MoiPaymentFormComponent,
    MoiPaymentStep1Component,
    MoiPaymentStep2Component,
    MoiPaymentStep3Component,
    MoiRefundComponent,
    MoiRefundFormComponent,
    MoiRefundStep1Component,
    MoiRefundStep2Component,
    MoiRefundStep3Component,
    FeedBackFilesStep1Component,
    FeedBackFilesStep2Component,
    FeedBackFilesStep3Component,
    MoiPaymentConfirmationTableComponent,
    BulkPaymentsComponent,
    BulkErrorComponent,
    BulkPaymentsListComponent,
  ],
})
export class PaymentsModule {}
