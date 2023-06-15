import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalaryPaymentsComponent } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments.component'

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
