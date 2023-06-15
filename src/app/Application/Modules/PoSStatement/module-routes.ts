import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardClaim } from './Claims/auth-guard-claim.service'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { ListPoSTerminalsComponent } from './ListPoSTerminals/list-pos-terminals.component'
import { PoSStatementOptionsComponent } from './pos-statement-options.component'
import { PosStatementOptionsGuard } from './pos-statement-options.guard'
import { AuthGuardRequestCRMStatus } from './PoSCRMStatus/auth-guard-request-status.service'
import { AuthGuardManageMaintenanceRequest } from './PoSMaintenanceRequest/auth-guard-manage-request.service'
import { AuthGuardManageManagementRequest } from './PoSManagementRequest/auth-guard-manage-request.service'
import { ListPoSOutstandingsComponent } from './PosOutstanding/pos-outstanding.component'
import { AuthGuardManageRequest } from './PoSRequest/auth-guard-manage-request.service'
import { AuthGuardRequesStatus } from './PoSRequestStatus/auth-guard-request-status.service'
// import { AccountsPosSearchCriteria } from "./PoSStatmentByterminal/accounts-pos-search-criteria.component";
//POS
import { AccountsPosSearchPanel } from './PoSStatmentByterminal/accounts-pos-search-panel.component'
import { TerminaldetailsComponent } from './Posterminaldetails/terminaldetails.component'

export const routes: Routes = [
  {
    path: '',
    canLoad: [PosStatementOptionsGuard],
    component: PoSStatementOptionsComponent,
  },
  { path: 'pos-statement', component: AccountsPosSearchPanel },
  { path: 'outstanding-statement', component: ListPoSOutstandingsComponent },
  { path: 'pos-terminal', component: ListPoSTerminalsComponent },
  { path: 'posterminalDetails', component: TerminaldetailsComponent },
  //{ path: 'pos-terminal', component: AccountsPosSearchPanel },
  {
    path: 'pos-request',
    canLoad: [AuthGuardManageRequest],
    loadChildren: () =>
      import('./PoSRequest/module-module').then((m) => m.PoSRequestModuleImpl),
  },
  {
    path: 'pos-manage-request',
    canLoad: [AuthGuardManageManagementRequest],
    loadChildren: () =>
      import('./PoSManagementRequest/module-module').then(
        (m) => m.PoSRequestModuleImpl,
      ),
  },
  {
    path: 'pos-maintenance-request',
    canLoad: [AuthGuardManageMaintenanceRequest],
    loadChildren: () =>
      import('./PoSMaintenanceRequest/module-module').then(
        (m) => m.PoSRequestModuleImpl,
      ),
  },
  {
    path: 'claims',
    canLoad: [AuthGuardClaim],
    loadChildren: () =>
      import('./Claims/module-module').then((m) => m.ClaimModuleImpl),
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequesStatus],
    loadChildren: () =>
      import('./PoSRequestStatus/module-module').then(
        (m) => m.PoSRequestStatusModuleImpl,
      ),
  },
  {
    path: 'crm-status',
    canLoad: [AuthGuardRequestCRMStatus],
    loadChildren: () =>
      import('./PoSCRMStatus/module-module').then(
        (m) => m.PoSCRMStatusModuleImpl,
      ),
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuardDashboard],
    loadChildren: () =>
      import('./Dashboard/module-module').then((m) => m.DashboardModuleImpl),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoSRoutingModule {}
