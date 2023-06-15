import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalaryPaymentsComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/SalaryPayments/salary-payments.component'

const routes: Routes = [
  {
    path: '',
    component: SalaryPaymentsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaryPaymentsRoutingModule {}
