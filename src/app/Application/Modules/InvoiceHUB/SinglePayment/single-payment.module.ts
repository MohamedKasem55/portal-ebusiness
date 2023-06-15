import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { Step4Component } from './components/Step4/step4.component'
import { SinglePaymentRoutingModule } from './single-payment-routing.module'
import { SinglePaymentComponent } from './single-payment.component'
import { SinglePaymentService } from './single-payment.service'

@NgModule({
  imports: [
    AppSharedModule,
    SinglePaymentRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    SinglePaymentComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  providers: [SinglePaymentService],
})
export class SinglePaymentModule {}
