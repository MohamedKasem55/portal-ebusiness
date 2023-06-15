import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { Step4Component } from './components/Step4/step4.component'
import { MultiPaymentRoutingModule } from './multi-payment-routing.module'
import { MultiPaymentComponent } from './multi-payment.component'
import { MultiPaymentService } from './multi-payment.service'

@NgModule({
  imports: [
    AppSharedModule,
    MultiPaymentRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    MultiPaymentComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  providers: [MultiPaymentService],
})
export class MultiPaymentModule {}
