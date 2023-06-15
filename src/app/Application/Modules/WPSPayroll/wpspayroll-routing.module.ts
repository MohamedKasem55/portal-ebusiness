import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardWPSPayrollManagement } from '../../Modules/WPSPayroll/WPSPayrollManagement/auth-guard-wpspayroll-management.service'
import { AuthGuardWPSPayrollOptions } from '../../Modules/WPSPayroll/WPSPayrollOptions/auth-guard-wpspayroll-options.service'
import { WPSPayrollOptionsComponent } from '../../Modules/WPSPayroll/WPSPayrollOptions/wpspayroll-options.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wpspayroll-management',
    pathMatch: 'full',
  },
  {
    path: 'wpspayroll-management',
    canLoad: [AuthGuardWPSPayrollManagement],
    loadChildren: () =>
      import('./WPSPayrollManagement/wpspayroll-management.module').then(
        (m) => m.WPSPayrollManagementModule,
      ),
  },
  {
    path: 'wpspayroll-options',
    canLoad: [AuthGuardWPSPayrollOptions],
    component: WPSPayrollOptionsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WPSPayrollRoutingModule {}
