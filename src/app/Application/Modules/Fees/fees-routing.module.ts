import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BulkPaymentsFeesManagementComponent } from './PayrollFees/BulkPaymentFees/bulk-payments-fees-management.component'
import { CardFeesManagementComponent } from './PayrollFees/CardFeesManagement/card-fees-management.component'
import { GeneralFeesManagement } from './PayrollFees/GeneralFeesManagement/general-fees-management.component'
import { PayrollFeesManagementComponent } from './PayrollFees/PayrollFeesManagement/payroll-fees-management.component'
import { WPSPayrollFeesManagementComponent } from './PayrollFees/WPSPayrollFeesManagement/wps-payroll-fees-management.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'payroll-fees',
    pathMatch: 'full',
  },
  {
    path: 'payroll-fees',
    component: PayrollFeesManagementComponent,
  },
  {
    path: 'wps-payroll-fees',
    component: WPSPayrollFeesManagementComponent,
  },
  {
    path: 'general-fees',
    component: GeneralFeesManagement,
  },
  {
    path: 'card-fees',
    component: CardFeesManagementComponent,
  },
  {
    path: 'bulk-payments-fees',
    component: BulkPaymentsFeesManagementComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeesRoutingModule {}
