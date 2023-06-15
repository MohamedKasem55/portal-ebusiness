import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { WMSPayrollRoutingModule } from './wmspayroll-routing.module'
import { AuthGuardWMSPayrollManagement } from './WMSPayrollManagement/auth-guard-wmspayroll-management.service'
import { AuthGuardWMSPayrollOptions } from './WMSPayrollOptions/auth-guard-wmspayroll-options.service'
import { WMSPayrollOptionsComponent } from './WMSPayrollOptions/wmspayroll-options.component'

@NgModule({
  imports: [AppSharedModule, WMSPayrollRoutingModule],
  declarations: [WMSPayrollOptionsComponent],
  providers: [AuthGuardWMSPayrollManagement, AuthGuardWMSPayrollOptions],
  exports: [WMSPayrollOptionsComponent],
})
export class WMSPayrollModule {}
