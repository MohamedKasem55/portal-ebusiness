import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { StopPaymentStep1Component } from './stop-payment-step1.component'
import { StopPaymentStep2Component } from './stop-payment-step2.component'
import { StopPaymentStep3Component } from './stop-payment-step3.component'
import { StopPaymentComponent } from './stop-payment.component'
import { RoutingModule } from './stop-payment.routes'
import { StopPaymentService } from './stop-payment.service'

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  declarations: [
    StopPaymentComponent,
    StopPaymentStep1Component,
    StopPaymentStep2Component,
    StopPaymentStep3Component,
  ],
  exports: [
    StopPaymentComponent,
    StopPaymentStep1Component,
    StopPaymentStep2Component,
    StopPaymentStep3Component,
  ],
  providers: [StopPaymentService],
})
export class StopPaymentModule {}
