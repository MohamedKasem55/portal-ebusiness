import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { WPSPayrollRoutingModule } from '../../Modules/WPSPayroll/wpspayroll-routing.module'
import { AuthGuardWPSPayrollManagement } from '../../Modules/WPSPayroll/WPSPayrollManagement/auth-guard-wpspayroll-management.service'
import { AuthGuardWPSPayrollOptions } from '../../Modules/WPSPayroll/WPSPayrollOptions/auth-guard-wpspayroll-options.service'
import { ManageEmployeeService } from './WPSPayrollManagement/ManageEmployees/manage-employee.service'

import { WPSPayrollOptionsComponent } from './WPSPayrollOptions/wpspayroll-options.component'
import { WpsPayrollService } from '../NewProduct/WpsPayrollNew/wps-payroll-new.service'

@NgModule({
  imports: [AppSharedModule, WPSPayrollRoutingModule],
  declarations: [WPSPayrollOptionsComponent],
  providers: [
    AuthGuardWPSPayrollManagement,
    AuthGuardWPSPayrollOptions,
    ManageEmployeeService,
    WpsPayrollService
  ],
  exports: [WPSPayrollOptionsComponent],
})
export class WPSPayrollModule {}
