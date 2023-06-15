import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../core/shared/shared.module'
// Services
import { AuthGuardClaim } from './Claims/auth-guard-claim.service'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { ListPoSTerminalsComponent } from './ListPoSTerminals/list-pos-terminals.component'
import { PoSRoutingModule } from './module-routes'
import { PoSStatementOptionsComponent } from './pos-statement-options.component'
import { PosStatementOptionsGuard } from './pos-statement-options.guard'
import { PoSStatementService } from './pos-statement.service'
import { AuthGuardRequestCRMStatus } from './PoSCRMStatus/auth-guard-request-status.service'
import { AuthGuardManageMaintenanceRequest } from './PoSMaintenanceRequest/auth-guard-manage-request.service'
import { AuthGuardManageManagementRequest } from './PoSManagementRequest/auth-guard-manage-request.service'
import { ListPoSOutstandingsComponent } from './PosOutstanding/pos-outstanding.component'
import { AuthGuardManageRequest } from './PoSRequest/auth-guard-manage-request.service'
import { AuthGuardRequesStatus } from './PoSRequestStatus/auth-guard-request-status.service'
import { AccountsPosSearchCriteria } from './PoSStatmentByterminal/accounts-pos-search-criteria.component'
import { AccountsPosSearchPanel } from './PoSStatmentByterminal/accounts-pos-search-panel.component'
import { Step1Component } from './Posterminaldetails/Steps/step1/step1.component'
import { Step2Component } from './Posterminaldetails/Steps/step2/step2.component'
import { Step3Component } from './Posterminaldetails/Steps/step3/step3.component'
import { Step4Component } from './Posterminaldetails/Steps/step4/step4.component'
import { TerminaldetailsComponent } from './Posterminaldetails/terminaldetails.component'
import { FormDataService } from './shared-form-data.service'

@NgModule({
  declarations: [
    PoSStatementOptionsComponent,
    AccountsPosSearchPanel,
    ListPoSTerminalsComponent,
    AccountsPosSearchCriteria,
    TerminaldetailsComponent,
    ListPoSOutstandingsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PoSRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    PoSStatementService,
    FormDataService,
    AuthGuardManageRequest,
    AuthGuardClaim,
    AuthGuardDashboard,
    AuthGuardManageManagementRequest,
    AuthGuardManageMaintenanceRequest,
    AuthGuardRequesStatus,
    AuthGuardRequestCRMStatus,
    PosStatementOptionsGuard,
  ],
  exports: [
    PoSStatementOptionsComponent,
    AccountsPosSearchPanel,
    ListPoSTerminalsComponent,
    TerminaldetailsComponent,
    ListPoSOutstandingsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
})
export class PoSModuleImpl {}
