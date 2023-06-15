import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { RequestReactivateStep1Component } from './reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateService } from './reactivate/request-reactivate.service'
import { RequestStatusRoutingModule } from './request-status-routing.module'
import { RequestStatusComponent } from './request-status.component'
import { RequestStatusService } from './request-status.service'
import { PrepaidCardsRequestStatusTableComponent } from './common/prepaid-cards-request-status-table/prepaid-cards-request-status-table.component'

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
    PrepaidCardsRequestStatusTableComponent,
  ],
  providers: [RequestReactivateService, RequestStatusService],
})
export class RequestStatusModule {}
