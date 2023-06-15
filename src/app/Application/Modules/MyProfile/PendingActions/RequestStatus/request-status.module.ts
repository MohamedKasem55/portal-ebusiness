import { NgModule } from '@angular/core'

import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { RequestStatusRoutingModule } from './request-status-routing.module'
import { RequestStatusComponent } from './request-status.component'
import { RequestStatusGuard } from './request-status.guard'
import { RequestStatusService } from './request-status.service'

@NgModule({
  imports: [AppSharedModule, RequestStatusRoutingModule],
  declarations: [RequestStatusComponent],
  providers: [RequestStatusService, RequestStatusGuard],
})
export class RequestStatusModule {}
