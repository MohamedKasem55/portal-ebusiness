import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { FeesRoutingModule } from './fees-routing.module'
import { FeesService } from './fees.service'
import { BulkPaymentsFeesManagementComponent } from './PayrollFees/BulkPaymentFees/bulk-payments-fees-management.component'
import { CardFeesManagementComponent } from './PayrollFees/CardFeesManagement/card-fees-management.component'
import { GeneralFeesManagement } from './PayrollFees/GeneralFeesManagement/general-fees-management.component'
import { PayrollFeesManagementComponent } from './PayrollFees/PayrollFeesManagement/payroll-fees-management.component'
import { WPSPayrollFeesManagementComponent } from './PayrollFees/WPSPayrollFeesManagement/wps-payroll-fees-management.component'

@NgModule({
  declarations: [
    PayrollFeesManagementComponent,
    WPSPayrollFeesManagementComponent,
    GeneralFeesManagement,
    CardFeesManagementComponent,
    BulkPaymentsFeesManagementComponent,
  ],
  imports: [AppSharedModule, FeesRoutingModule],
  providers: [FeesService],
})
export class FeesModule {}
