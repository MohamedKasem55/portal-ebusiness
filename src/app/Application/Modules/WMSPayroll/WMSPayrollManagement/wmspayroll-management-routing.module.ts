import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardDownloadMol } from '../../../Modules/WMSPayroll/WMSPayrollManagement/DownloadMol/auth-guard-download-mol.service'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { AuthGuardFileUpload } from './FileUpload/auth-guard-file-upload.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardViewProcessedFiles } from './ViewProcessedFiles/auth-guard-view-processed-files.service'
import { PayrollManagementComponent } from './wmspayroll-management.component'

const routes: Routes = [
  {
    path: '',
    component: PayrollManagementComponent,
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuardDashboard],
    loadChildren: () =>
      import('./Dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
  {
    path: 'salary-payment-upload-file',
    canLoad: [AuthGuardFileUpload],
    loadChildren: () =>
      import('./FileUpload/file-upload.module').then((m) => m.FileUploadModule),
    data: { type: 'salary' },
  },
  {
    path: 'view-processed-files',
    canLoad: [AuthGuardViewProcessedFiles],
    loadChildren: () =>
      import('./ViewProcessedFiles/view-processed-files.module').then(
        (m) => m.ViewProcessedFilesModule,
      ),
  },
  {
    path: 'download-mol',
    canLoad: [AuthGuardDownloadMol],
    loadChildren: () =>
      import('./DownloadMol/download-mol-file.module').then(
        (m) => m.DownloadMolFileModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollManagementRoutingModule {}
