import { NgModule } from '@angular/core'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { PayrollRoutingModule } from '../../Modules/Payroll/payroll-routing.module'
import { AuthGuardPayrollCards } from '../../Modules/Payroll/PayrollCards/auth-guard-payroll-cards.service'
import { AuthGuardPayrollManagement } from '../../Modules/Payroll/PayrollManagement/auth-guard-payroll-management.service'
import { AuthGuardPayrollOptions } from '../../Modules/Payroll/PayrollOptions/auth-guard-payroll-options.service'
import { SharedModule } from '../shared/shared.module'
import { ManageEmployeeService } from './PayrollManagement/ManageEmployees/manage-employee.service'
import { PayrollOptionsComponent } from './PayrollOptions/payroll-options.component'

@NgModule({
  imports: [AppSharedModule, PayrollRoutingModule, SharedModule],
  declarations: [PayrollOptionsComponent],
  providers: [
    AuthGuardPayrollManagement,
    AuthGuardPayrollCards,
    AuthGuardPayrollOptions,
    ManageEmployeeService,
    AuthenticationService,
  ],
  exports: [PayrollOptionsComponent],
})
export class PayrollModule {}
