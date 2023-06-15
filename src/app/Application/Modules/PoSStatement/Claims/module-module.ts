import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AddClaimStep1Component } from './addClaims/add-claim-step1.component'
import { AddClaimStep2Component } from './addClaims/add-claim-step2.component'
import { AddClaimStep3Component } from './addClaims/add-claim-step3.component'
import { AddClaimComponent } from './addClaims/add-claim.component'
// Services
import { AuthGuardClaim } from './auth-guard-claim.service'
import { ClaimCRMStatusComponent } from './claim-crm-status.component'
import { ClaimShareService } from './claim-share.service'
import { ClaimComponent } from './claim.component'
import { ClaimService } from './claim.service'
import { ClaimRoutingModule } from './module-routes'
import { RequestDetailComponent } from './RequestStatus/detail/request-detail.component'
import { RequestReactivateStep1Component } from './RequestStatus/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './RequestStatus/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './RequestStatus/reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateService } from './RequestStatus/reactivate/request-reactivate.service'
import { RequestStatusComponent } from './RequestStatus/request-status.component'
import { RequestStatusService } from './RequestStatus/request-status.service'

@NgModule({
  declarations: [
    ClaimComponent,
    ClaimCRMStatusComponent,
    RequestDetailComponent,
    RequestStatusComponent,
    AddClaimComponent,
    AddClaimStep1Component,
    AddClaimStep2Component,
    AddClaimStep3Component,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ClaimRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    ClaimService,
    ClaimShareService,
    RequestReactivateService,
    RequestStatusService,
    AuthGuardClaim,
  ],
  exports: [
    ClaimComponent,
    ClaimCRMStatusComponent,
    RequestDetailComponent,
    RequestStatusComponent,
    AddClaimComponent,
    AddClaimStep1Component,
    AddClaimStep2Component,
    AddClaimStep3Component,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
  ],
})
export class ClaimModuleImpl {}
