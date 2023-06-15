import {NgModule} from '@angular/core'
import {AppSharedModule} from '../../../../../core/shared/shared.module'
import {BulkPaymentsRoutingModule} from './bulk-payments-routing.module'
import {BulkPaymentsComponent} from './bulk-payments.component'
import {BulkPaymentTableComponent} from './components/common/bulk-payment-table.component'
import {Step1Component} from './components/Step1/step1.component'
import {Step2Component} from './components/Step2/step2.component'
import {Step3Component} from './components/Step3/step3.component'
import {BulkPaymentService} from './bulk-payment.service'
import {BulkPaymentGuard} from './bulk-payment.guard'
import {CommonModule} from '@angular/common'
import {SharedModule} from 'app/Application/Modules/shared/shared.module'
import {PendingActionsModule} from '../pending-actions.module'
import {BulkPaymentDetailComponent} from "./components/common/bulk-payment-detail.component";

@NgModule({
    imports: [
        AppSharedModule,
        BulkPaymentsRoutingModule,
        CommonModule,
        SharedModule,
        PendingActionsModule,
    ],
    declarations: [
        BulkPaymentTableComponent,
        BulkPaymentDetailComponent,
        BulkPaymentsComponent,
        Step1Component,
        Step2Component,
        Step3Component,
    ],
    providers: [BulkPaymentService, BulkPaymentGuard],
})
export class BulkPaymentsModule {
}
