import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { BeneficiaryListRoutingModule } from './beneficiary-list-routing.module'
import { BeneficiaryListService } from './beneficiary-list.service'
import { BeneficiaryComponent } from './beneficiary.component'
import { DeleteComponent } from './components/delete/delete.component'
import { DetailComponent } from './components/details/detail.component'
import { ListComponent } from './components/list/list.component'
import { Step2Component } from './components/payment/components/Step2/step2.component'
import { Step3Component } from './components/payment/components/Step3/step3.component'
import { Step4Component } from './components/payment/components/Step4/step4.component'
import { NewPaymentComponent } from './components/payment/new-payment.component'
import { NewPaymentService } from './components/payment/new-payment.service'

@NgModule({
  imports: [
    AppSharedModule,
    BeneficiaryListRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    BeneficiaryComponent,
    ListComponent,
    DetailComponent,
    DeleteComponent,
    NewPaymentComponent,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  providers: [BeneficiaryListService, NewPaymentService],
})
export class BeneficiaryListModule {}
