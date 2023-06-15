import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardDownloadTemplates } from '../../../Modules/Payroll/PayrollManagement/DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFileUpload } from '../../../Modules/Payroll/PayrollManagement/FileUpload/auth-guard-file-upload.service'
import { AuthGuardManageEmployees } from '../../../Modules/Payroll/PayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { PayrollManagementComponent } from '../../../Modules/Payroll/PayrollManagement/payroll-management.component'
import { AuthGuardRequestStatus } from '../../../Modules/Payroll/PayrollManagement/RequestStatus/auth-guard-request-status.service'
import { AuthGuardSalaryPayments } from '../../../Modules/Payroll/PayrollManagement/SalaryPayments/auth-guard-salary-payments.service'
import { AuthGuardViewProcessedFiles } from '../../../Modules/Payroll/PayrollManagement/ViewProcessedFiles/auth-guard-view-processed-files.service'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { PayrollManagementRoutingModule } from './payroll-management-routing.module'

@NgModule({
  imports: [AppSharedModule, PayrollManagementRoutingModule],
  declarations: [PayrollManagementComponent],
  providers: [
    AuthGuardManageEmployees,
    AuthGuardSalaryPayments,
    AuthGuardFileUpload,
    AuthGuardViewProcessedFiles,
    AuthGuardRequestStatus,
    AuthGuardDownloadTemplates,
    AuthGuardDashboard,
  ],
})
export class PayrollManagementModule {}
