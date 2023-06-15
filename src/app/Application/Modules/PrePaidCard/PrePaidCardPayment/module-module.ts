import { PrePaidCardService } from '../prePaidCard.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { PrePaidCardPaymentComponent } from './prePaidCardPayment.component'
import { PrePaidCardPaymentStep1Component } from './prePaidCardPayment-step1.component'
import { PrePaidCardPaymentStep2Component } from './prePaidCardPayment-step2.component'
import { PrePaidCardPaymentStep3Component } from './prePaidCardPayment-step3.component'
import { PrePaidCardPaymentStep4Component } from './prePaidCardPayment-step4.component'
import { AuthGuardCardPayment } from './auth-guard.service'
import { StaticService } from '../../Common/Services/static.service'

@NgModule({
  declarations: [
    PrePaidCardPaymentComponent,
    PrePaidCardPaymentStep1Component,
    PrePaidCardPaymentStep2Component,
    PrePaidCardPaymentStep3Component,
    PrePaidCardPaymentStep4Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardCardPayment, StaticService],
  exports: [
    PrePaidCardPaymentComponent,
    PrePaidCardPaymentStep1Component,
    PrePaidCardPaymentStep2Component,
    PrePaidCardPaymentStep3Component,
    PrePaidCardPaymentStep4Component,
  ],
})
export class PrePaidCardPaymentModule {}
