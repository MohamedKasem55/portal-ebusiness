import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/AddEmployee/add-employee.component'
import { AuthGuardManageEmployees } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { DeleteEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/DeleteEmployee/delete-employee.component'
import { ManageEmployeesComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/manage-employees.component'
import { ModifyEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/ModifyEmployee/modify-employee.component'

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
