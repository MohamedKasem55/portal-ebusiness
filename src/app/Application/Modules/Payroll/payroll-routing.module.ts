import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardPayrollCards } from '../../Modules/Payroll/PayrollCards/auth-guard-payroll-cards.service'
import { AuthGuardPayrollManagement } from '../../Modules/Payroll/PayrollManagement/auth-guard-payroll-management.service'
import { PayrollOptionsComponent } from '../../Modules/Payroll/PayrollOptions/payroll-options.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'payroll-management',
    pathMatch: 'full',
  },
  {
    path: 'payroll-management',
    canLoad: [AuthGuardPayrollManagement],
    loadChildren: () =>
      import('./PayrollManagement/payroll-management.module').then(
        (m) => m.PayrollManagementModule,
      ),
  },
  {
    path: 'payroll-cards',
    canLoad: [AuthGuardPayrollCards],
    loadChildren: () =>
      import('./PayrollCards/payroll-cards.module').then(
        (m) => m.PayrollCardsModule,
      ),
  },
  {
    path: 'payroll-options',
    canLoad: [AuthGuardPayrollCards],
    component: PayrollOptionsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
