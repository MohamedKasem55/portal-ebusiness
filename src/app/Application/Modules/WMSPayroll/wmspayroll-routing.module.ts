import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardWMSPayrollManagement } from './WMSPayrollManagement/auth-guard-wmspayroll-management.service'
import { WMSPayrollOptionsComponent } from './WMSPayrollOptions/wmspayroll-options.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wmspayroll-management',
    pathMatch: 'full',
  },
  {
    path: 'wmspayroll-management',
    canLoad: [AuthGuardWMSPayrollManagement],
    loadChildren: () =>
      import('./WMSPayrollManagement/wmspayroll-management.module').then(
        (m) => m.WMSPayrollManagementModule,
      ),
  },
  {
    path: 'wpspayroll-options',
    //canLoad: [AuthGuardWPSPayrollCards],
    component: WMSPayrollOptionsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WMSPayrollRoutingModule {}
