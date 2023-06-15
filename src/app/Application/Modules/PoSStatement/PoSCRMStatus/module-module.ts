import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardRequestCRMStatus } from './auth-guard-request-status.service'
// Services
import { DetailRequestComponent } from './Details/detail-request.component'
import { ManageRequestComponent } from './manage-request.component'
import { ManageRequestService } from './manage-request.service'
import { PoSCRMStatusRoutingModule } from './module-routes'
import { RequestShareService } from './request-share.service'

@NgModule({
  declarations: [ManageRequestComponent, DetailRequestComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    PoSCRMStatusRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    ManageRequestService,
    RequestShareService,
    AuthGuardRequestCRMStatus,
  ],
  exports: [ManageRequestComponent, DetailRequestComponent],
})
export class PoSCRMStatusModuleImpl {}
