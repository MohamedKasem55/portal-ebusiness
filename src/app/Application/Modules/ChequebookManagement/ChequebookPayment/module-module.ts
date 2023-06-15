import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardChequebookPayment } from './auth-guard.service'
import { ChequebookPaymentStep1Component } from './chequebook-payment-step1.component'
import { ChequebookPaymentStep2Component } from './chequebook-payment-step2.component'
import { ChequebookPaymentStep3Component } from './chequebook-payment-step3.component'
//Components
import { ChequebookPaymentComponent } from './chequebook-payment.component'
//Services
import { ChequebookPaymentService } from './chequebook-payment.service'
import { RoutingModule } from './module-routes'
import { NewInquiryStep1Component } from './NewInquiry/new-inquiry-step1.component'
import { NewInquiryStep2Component } from './NewInquiry/new-inquiry-step2.component'
import { NewInquiryStep3Component } from './NewInquiry/new-inquiry-step3.component'
import { NewInquiryComponent } from './NewInquiry/new-inquiry.component'
import { NewInquiryService } from './NewInquiry/new-inquiry.service'

@NgModule({
  declarations: [
    ChequebookPaymentComponent,
    ChequebookPaymentStep1Component,
    ChequebookPaymentStep2Component,
    ChequebookPaymentStep3Component,
    NewInquiryComponent,
    NewInquiryStep1Component,
    NewInquiryStep2Component,
    NewInquiryStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [
    AuthGuardChequebookPayment,
    ChequebookPaymentService,
    NewInquiryService,
  ],
  exports: [
    ChequebookPaymentComponent,
    ChequebookPaymentStep1Component,
    ChequebookPaymentStep2Component,
    ChequebookPaymentStep3Component,
    NewInquiryComponent,
    NewInquiryStep1Component,
    NewInquiryStep2Component,
    NewInquiryStep3Component,
  ],
})
export class ChequebookPaymentModule {}
