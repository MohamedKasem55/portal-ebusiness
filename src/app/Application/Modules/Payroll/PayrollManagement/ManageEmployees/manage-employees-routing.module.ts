import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddEmployeeComponent } from '../../../../Modules/Payroll/PayrollManagement/ManageEmployees/AddEmployee/add-employee.component'
import { AuthGuardManageEmployees } from '../../../../Modules/Payroll/PayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { DeleteEmployeeComponent } from '../../../../Modules/Payroll/PayrollManagement/ManageEmployees/DeleteEmployee/delete-employee.component'
import { ManageEmployeesComponent } from '../../../../Modules/Payroll/PayrollManagement/ManageEmployees/manage-employees.component'
import { ModifyEmployeeComponent } from '../../../../Modules/Payroll/PayrollManagement/ManageEmployees/ModifyEmployee/modify-employee.component'

const routes: Routes = [
  {
    path: '',
    component: ManageEmployeesComponent,
  },
  {
    path: 'addEmployee',
    canActivate: [AuthGuardManageEmployees],
    component: AddEmployeeComponent,
  },
  {
    path: 'deleteEmployee',
    canActivate: [AuthGuardManageEmployees],
    component: DeleteEmployeeComponent,
  },
  {
    path: 'modifyEmployee',
    canActivate: [AuthGuardManageEmployees],
    component: ModifyEmployeeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEmployeesRoutingModule {}
