import {NgModule} from '@angular/core'

import {AppSharedModule} from '../../../../../core/shared/shared.module'
import {GovernmentRevenueTransferPaymentsDetailComponent} from './common/government-revenue-transfer-payments-detail.component'
import {GovernmentRevenueTransferPaymentsTableComponent} from './common/government-revenue-transfer-payments-table.component'
import {OriginatorTableComponent} from './common/originator-table.component'
import {RevenueAccountsTableComponent} from './common/revenue-accounts-table.component'
import {Step1Component} from './components/Step1/step1.component'
import {DetailComponent} from './components/detail/detail.component'
import {Step2Component} from './components/Step2/step2.component'
import {Step3Component} from './components/Step3/step3.component'
import {GovernmentRevenueTransferPaymentsRoutingModule} from './government-revenue-transfer-payments-routing.module'
import {GovernmentRevenueTransferPaymentsComponent} from './government-revenue-transfer-payments.component'
import {GovernmentRevenueTransferPaymentsService} from './government-revenue-transfer-payments.service'
import {CommonModule} from '@angular/common'
import {SharedModule} from 'app/Application/Modules/shared/shared.module'
import {PendingActionsModule} from '../pending-actions.module'
import {FileDetailComponent} from "./components/detail/file-detail.component";
import {GovernmentRevenueFileTransferPaymentsTableComponent} from "./common/government-revenue-file-transfer-payments-table.component";
import {GovernmentRevenueFileTransferPaymentsDetailComponent} from "./common/government-revenue-file-transfer-payments-detail.component";
import {GovernmentRevenueModule} from "../../../GovernmentRevenue/government-revenue.module";

@NgModule({
    declarations: [
        GovernmentRevenueTransferPaymentsComponent,
        GovernmentRevenueTransferPaymentsDetailComponent,
        GovernmentRevenueTransferPaymentsTableComponent,
        GovernmentRevenueFileTransferPaymentsTableComponent,
        GovernmentRevenueFileTransferPaymentsDetailComponent,
        Step1Component,
        DetailComponent,
        FileDetailComponent,
        Step2Component,
        Step3Component,
        OriginatorTableComponent,
        RevenueAccountsTableComponent,
    ],
    imports: [
        AppSharedModule,
        GovernmentRevenueTransferPaymentsRoutingModule,
        CommonModule,
        SharedModule,
        PendingActionsModule,
        GovernmentRevenueModule,
    ],
    providers: [
        GovernmentRevenueTransferPaymentsService
    ],
})
export class GovernmentRevenueTransferPaymentsModule {
}
