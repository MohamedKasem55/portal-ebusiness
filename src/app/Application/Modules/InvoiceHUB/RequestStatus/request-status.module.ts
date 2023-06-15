import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { RequestReactivateStep1Component } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateService } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate.service'
import { RequestStatusRoutingModule } from '../../../Modules/InvoiceHUB/RequestStatus/request-status-routing.module'
import { RequestStatusComponent } from '../../../Modules/InvoiceHUB/RequestStatus/request-status.component'
import { RequestStatusService } from './request-status.service'

@NgModule({
  imports: [
    AppSharedModule,
    RequestStatusRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
  providers: [RequestReactivateService, RequestStatusService],
})
export class RequestStatusModule {}
