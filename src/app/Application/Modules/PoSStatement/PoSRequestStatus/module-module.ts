import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardRequesStatus } from './auth-guard-request-status.service'
import { PoSRequestStatusRoutingModule } from './module-routes'
import { RequestReactivateStep1Component as RequestReactivateClaimStep1Component } from './reactivate-claims/request-reactivate-step1.component'
import { RequestReactivateStep2Component as RequestReactivateClaimStep2Component } from './reactivate-claims/request-reactivate-step2.component'
import { RequestReactivateStep3Component as RequestReactivateClaimStep3Component } from './reactivate-claims/request-reactivate-step3.component'
import { RequestReactivateComponent as RequestReactivateClaimComponent } from './reactivate-claims/request-reactivate.component'
import { RequestReactivateService as RequestReactivateClaimService } from './reactivate-claims/request-reactivate.service'
import { RequestReactivateStep1Component as RequestReactivateMaintenanceStep1Component } from './reactivate-maintenance/request-reactivate-step1.component'
import { RequestReactivateStep2Component as RequestReactivateMaintenanceStep2Component } from './reactivate-maintenance/request-reactivate-step2.component'
import { RequestReactivateStep3Component as RequestReactivateMaintenanceStep3Component } from './reactivate-maintenance/request-reactivate-step3.component'
import { RequestReactivateComponent as RequestReactivateMaintenanceComponent } from './reactivate-maintenance/request-reactivate.component'
import { RequestReactivateService as RequestReactivateMaintenanceService } from './reactivate-maintenance/request-reactivate.service'
import { RequestReactivateStep1Component as RequestReactivateManagementStep1Component } from './reactivate-management/request-reactivate-step1.component'
import { RequestReactivateStep2Component as RequestReactivateManagementStep2Component } from './reactivate-management/request-reactivate-step2.component'
import { RequestReactivateStep3Component as RequestReactivateManagementStep3Component } from './reactivate-management/request-reactivate-step3.component'
import { RequestReactivateComponent as RequestReactivateManagementComponent } from './reactivate-management/request-reactivate.component'
import { RequestReactivateService as RequestReactivateManagementService } from './reactivate-management/request-reactivate.service'
import { RequestReactivateStep1Component as RequestReactivateRequestStep1Component } from './reactivate-request/request-reactivate-step1.component'
import { RequestReactivateStep2Component as RequestReactivateRequestStep2Component } from './reactivate-request/request-reactivate-step2.component'
import { RequestReactivateStep3Component as RequestReactivateRequestStep3Component } from './reactivate-request/request-reactivate-step3.component'
import { RequestReactivateComponent as RequestReactivateRequestComponent } from './reactivate-request/request-reactivate.component'
import { RequestReactivateService as RequestReactivateRequestService } from './reactivate-request/request-reactivate.service'
// Services
import { RequestStatusComponent } from './request-status.component'
import { RequestStatusService } from './request-status.service'

@NgModule({
  declarations: [
    RequestStatusComponent,
    RequestReactivateRequestComponent,
    RequestReactivateRequestStep1Component,
    RequestReactivateRequestStep2Component,
    RequestReactivateRequestStep3Component,
    RequestReactivateMaintenanceComponent,
    RequestReactivateMaintenanceStep1Component,
    RequestReactivateMaintenanceStep2Component,
    RequestReactivateMaintenanceStep3Component,
    RequestReactivateManagementComponent,
    RequestReactivateManagementStep1Component,
    RequestReactivateManagementStep2Component,
    RequestReactivateManagementStep3Component,
    RequestReactivateClaimComponent,
    RequestReactivateClaimStep1Component,
    RequestReactivateClaimStep2Component,
    RequestReactivateClaimStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PoSRequestStatusRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    RequestStatusService,
    AuthGuardRequesStatus,
    RequestReactivateRequestService,
    RequestReactivateMaintenanceService,
    RequestReactivateManagementService,
    RequestReactivateClaimService,
  ],
  exports: [
    RequestStatusComponent,
    RequestReactivateRequestComponent,
    RequestReactivateRequestStep1Component,
    RequestReactivateRequestStep2Component,
    RequestReactivateRequestStep3Component,
    RequestReactivateMaintenanceComponent,
    RequestReactivateMaintenanceStep1Component,
    RequestReactivateMaintenanceStep2Component,
    RequestReactivateMaintenanceStep3Component,
    RequestReactivateManagementComponent,
    RequestReactivateManagementStep1Component,
    RequestReactivateManagementStep2Component,
    RequestReactivateManagementStep3Component,
    RequestReactivateClaimComponent,
    RequestReactivateClaimStep1Component,
    RequestReactivateClaimStep2Component,
    RequestReactivateClaimStep3Component,
  ],
})
export class PoSRequestStatusModuleImpl {}
