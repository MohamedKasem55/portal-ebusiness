import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { RequestReactivateStep1Component } from './reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateService } from './reactivate/request-reactivate.service'
import { RequestReactivateStopStep1Component } from './reactivateStopCheque/request-reactivate-stop-step1.component'
import { RequestReactivateStopStep2Component } from './reactivateStopCheque/request-reactivate-stop-step2.component'
import { RequestReactivateStopStep3Component } from './reactivateStopCheque/request-reactivate-stop-step3.component'
import { RequestReactivateStopComponent } from './reactivateStopCheque/request-reactivate-stop.component'
import { RequestReactivateStopService } from './reactivateStopCheque/request-reactivate-stop.service'
import { RequestStatusRoutingModule } from './request-status-routing.module'
import { RequestStatusComponent } from './request-status.component'
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
    RequestReactivateStopComponent,
    RequestReactivateStopStep1Component,
    RequestReactivateStopStep2Component,
    RequestReactivateStopStep3Component,
  ],
  providers: [
    RequestReactivateService,
    RequestStatusService,
    RequestReactivateStopService,
  ],
})
export class RequestStatusModule {}
