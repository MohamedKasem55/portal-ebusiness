import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardDownloadMol } from '../../../Modules/WPSPayroll/WPSPayrollManagement/DownloadMol/auth-guard-download-mol.service'
import { AuthGuardDownloadTemplates } from '../../../Modules/WPSPayroll/WPSPayrollManagement/DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFileUpload } from '../../../Modules/WPSPayroll/WPSPayrollManagement/FileUpload/auth-guard-file-upload.service'
import { AuthGuardManageEmployees } from '../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { AuthGuardRequestStatus } from '../../../Modules/WPSPayroll/WPSPayrollManagement/RequestStatus/auth-guard-request-status.service'
import { AuthGuardSalaryPayments } from '../../../Modules/WPSPayroll/WPSPayrollManagement/SalaryPayments/auth-guard-salary-payments.service'
import { AuthGuardViewProcessedFiles } from '../../../Modules/WPSPayroll/WPSPayrollManagement/ViewProcessedFiles/auth-guard-view-processed-files.service'
import { PayrollManagementRoutingModule } from '../../../Modules/WPSPayroll/WPSPayrollManagement/wpspayroll-management-routing.module'
import { PayrollManagementComponent } from '../../../Modules/WPSPayroll/WPSPayrollManagement/wpspayroll-management.component'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
// import { AuthGuardDashboard } from '../../../Modules/WPSPayroll/WPSPayrollManagement/Dashboard/auth-guard-dashboard.service';

@NgModule({
  imports: [AppSharedModule, PayrollManagementRoutingModule],
  declarations: [PayrollManagementComponent],
  providers: [
    AuthGuardManageEmployees,
    AuthGuardSalaryPayments,
    AuthGuardFileUpload,
    AuthGuardViewProcessedFiles,
    AuthGuardRequestStatus,
    AuthGuardDownloadMol,
    AuthGuardDownloadTemplates,
    AuthGuardDashboard,
  ],
})
export class WPSPayrollManagementModule {}
