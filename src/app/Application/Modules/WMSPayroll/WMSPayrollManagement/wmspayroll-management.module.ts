import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardDownloadMol } from '../../../Modules/WMSPayroll/WMSPayrollManagement/DownloadMol/auth-guard-download-mol.service'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { AuthGuardFileUpload } from './FileUpload/auth-guard-file-upload.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardViewProcessedFiles } from './ViewProcessedFiles/auth-guard-view-processed-files.service'
import { PayrollManagementRoutingModule } from './wmspayroll-management-routing.module'
import { PayrollManagementComponent } from './wmspayroll-management.component'

@NgModule({
  imports: [AppSharedModule, PayrollManagementRoutingModule],
  declarations: [PayrollManagementComponent],
  providers: [
    AuthGuardFileUpload,
    AuthGuardRequestStatus,
    AuthGuardViewProcessedFiles,
    AuthGuardDownloadMol,
    AuthGuardDashboard,
  ],
})
export class WMSPayrollManagementModule {}
