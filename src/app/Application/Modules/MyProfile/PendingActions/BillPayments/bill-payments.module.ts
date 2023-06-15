import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { BillPaymentsRoutingModule } from './bill-payments-routing.module'
import { BillPaymentsComponent } from './bill-payments.component'
import { BillPaymentsGuard } from './bill-payments.guard'
import { BillPaymentsService } from './bill-payments.service'
import { BillPaymentTableComponent } from './components/common/bill-payment-table.component'
import { BillTableComponent } from './components/common/bill-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    BillPaymentsRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    BillPaymentTableComponent,
    BillTableComponent,
    BillPaymentsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [BillPaymentsService, BillPaymentsGuard],
})
export class BillPaymentsModule {}
