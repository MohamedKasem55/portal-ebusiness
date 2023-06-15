import { NgModule } from '@angular/core'

// Service to GET list of payments orders
import { RequestStatusPayments } from '../Services/request-status-payments-list.service'
import { RequestStatusRefunds } from '../Services/request-status-refunds-list.service'
import { RequestStatusService } from './request-status.service'

import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SharedModule } from '../../../shared/shared.module'
import { RequestReactivateStep1Component } from './reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateService } from './reactivate/request-reactivate.service'
import { RequestStatusRoutingModule } from './request-status-routing.module'
import { RequestStatusComponent } from './request-status.component'

@NgModule({
  imports: [AppSharedModule, RequestStatusRoutingModule, SharedModule],
  declarations: [
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
  providers: [
    RequestStatusPayments,
    RequestStatusRefunds,
    RequestStatusService,
    RequestReactivateService,
  ],
})
export class RequestStatusModule {}
