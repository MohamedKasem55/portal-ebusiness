import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
// Services
import { AddRequestStep1Component } from './AddPoSRequest/add-request-step1.component'
import { AddRequestStep2Component } from './AddPoSRequest/add-request-step2.component'
import { AddRequestStep3Component } from './AddPoSRequest/add-request-step3.component'
import { AddRequestComponent } from './AddPoSRequest/add-request.component'
import { AuthGuardManageRequest } from './auth-guard-manage-request.service'
import { DetailRequestComponent } from './DetailPoSRequest/detail-request.component'
import { ManageRequestComponent } from './manage-request.component'
import { ManageRequestService } from './manage-request.service'
import { PoSRequestRoutingModule } from './module-routes'
import { RequestShareService } from './request-share.service'
import { RequestReactivateStep1Component } from './RequestStatus/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './RequestStatus/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './RequestStatus/reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateService } from './RequestStatus/reactivate/request-reactivate.service'
import { RequestStatusComponent } from './RequestStatus/request-status.component'
import { RequestStatusService } from './RequestStatus/request-status.service'

@NgModule({
  declarations: [
    ManageRequestComponent,
    AddRequestComponent,
    AddRequestStep1Component,
    AddRequestStep2Component,
    AddRequestStep3Component,
    DetailRequestComponent,
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PoSRequestRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    ManageRequestService,
    RequestShareService,
    RequestReactivateService,
    RequestStatusService,
    AuthGuardManageRequest,
  ],
  exports: [
    ManageRequestComponent,
    AddRequestComponent,
    AddRequestStep1Component,
    AddRequestStep2Component,
    AddRequestStep3Component,
    DetailRequestComponent,
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
})
export class PoSRequestModuleImpl {}
