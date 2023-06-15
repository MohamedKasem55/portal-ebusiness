import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { AddEmployeeStep1Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/AddEmployee/add-employee-step1.component'
import { AddEmployeeStep2Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/AddEmployee/add-employee-step2.component'
import { AddEmployeeStep3Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/AddEmployee/add-employee-step3.component'
import { AddEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/AddEmployee/add-employee.component'
import { DeleteEmployeeStep2Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/DeleteEmployee/delete-employee-step2.component'
import { DeleteEmployeeStep3Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/DeleteEmployee/delete-employee-step3.component'
import { DeleteEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/DeleteEmployee/delete-employee.component'
import { ManageEmployeesRoutingModule } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/manage-employees-routing.module'
import { ManageEmployeesComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/manage-employees.component'
import { ModifyEmployeeStep1Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/ModifyEmployee/modify-employee-step1.component'
import { ModifyEmployeeStep2Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/ModifyEmployee/modify-employee-step2.component'
import { ModifyEmployeeStep3Component } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/ModifyEmployee/modify-employee-step3.component'
import { ModifyEmployeeComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/ModifyEmployee/modify-employee.component'

import { EmployeeShareService } from './employee-share.service'
import { ManageEmployeeCompanyService } from './manage-employee-company.service'

@NgModule({
  imports: [AppSharedModule, ManageEmployeesRoutingModule],
  declarations: [
    ManageEmployeesComponent,
    AddEmployeeComponent,
    AddEmployeeStep1Component,
    AddEmployeeStep2Component,
    AddEmployeeStep3Component,
    ModifyEmployeeComponent,
    ModifyEmployeeStep1Component,
    ModifyEmployeeStep2Component,
    ModifyEmployeeStep3Component,
    DeleteEmployeeComponent,
    DeleteEmployeeStep2Component,
    DeleteEmployeeStep3Component,
  ],
  providers: [ManageEmployeeCompanyService, EmployeeShareService],
})
export class ManageEmployeesModule {}
