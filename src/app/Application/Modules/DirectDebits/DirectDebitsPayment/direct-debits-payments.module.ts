import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ManagePayerService } from '../ManagePayer/manage-payer.service'
import { DirectDebitsPaymentsRoutingModule } from './direct-debits-payments-routing.module'
import { DirectDebitsPaymentsStep1Component } from './direct-debits-payments-step1.component'
import { DirectDebitsPaymentsStep2Component } from './direct-debits-payments-step2.component'
import { DirectDebitsPaymentsStep3Component } from './direct-debits-payments-step3.component'
import { DirectDebitsPaymentsComponent } from './direct-debits-payments.component'
import { DirectDebitsPaymentsService } from './direct-debits-payments.service'

@NgModule({
  imports: [
    AppSharedModule,
    ReactiveFormsModule,
    DirectDebitsPaymentsRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    DirectDebitsPaymentsComponent,
    DirectDebitsPaymentsStep1Component,
    DirectDebitsPaymentsStep2Component,
    DirectDebitsPaymentsStep3Component,
  ],
  providers: [DirectDebitsPaymentsService, ManagePayerService],
})
export class DirectDebitsPaymentsModule {}
