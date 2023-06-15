import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { MoiPaymentTableComponent } from './common/moi-payment-table.component'
import { MoiRefundTableComponent } from './common/moi-refund-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { MoiPaymentsRoutingModule } from './moi-payments-routing.module'
import { MoiPaymentsComponent } from './moi-payments.component'
import { MoiPaymentsGuard } from './moi-payments.guard'
import { MoiPaymentsService } from './moi-payments.service'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'
import { MoiPaymentPaConfirmationTableComponent } from './common/moi-payment-pa-confirmation-table.component'
import { MoiRefundPaConfirmationTableComponent } from './common/moi-refund-pa-confirmation-table.component'

@NgModule({
  imports: [
    AppSharedModule,
    MoiPaymentsRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    MoiPaymentPaConfirmationTableComponent,
    MoiRefundPaConfirmationTableComponent,
    MoiPaymentTableComponent,
    MoiRefundTableComponent,
    MoiPaymentsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [MoiPaymentsService, MoiPaymentsGuard],
})
export class MoiPaymentsModule {}
