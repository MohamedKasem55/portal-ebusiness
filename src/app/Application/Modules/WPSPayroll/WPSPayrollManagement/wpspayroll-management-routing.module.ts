import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardDownloadMol } from '../../../Modules/WPSPayroll/WPSPayrollManagement/DownloadMol/auth-guard-download-mol.service'
import { AuthGuardDownloadTemplates } from '../../../Modules/WPSPayroll/WPSPayrollManagement/DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFileUpload } from '../../../Modules/WPSPayroll/WPSPayrollManagement/FileUpload/auth-guard-file-upload.service'
import { AuthGuardManageEmployees } from '../../../Modules/WPSPayroll/WPSPayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { AuthGuardRequestStatus } from '../../../Modules/WPSPayroll/WPSPayrollManagement/RequestStatus/auth-guard-request-status.service'
import { AuthGuardSalaryPayments } from '../../../Modules/WPSPayroll/WPSPayrollManagement/SalaryPayments/auth-guard-salary-payments.service'
import { AuthGuardViewProcessedFiles } from '../../../Modules/WPSPayroll/WPSPayrollManagement/ViewProcessedFiles/auth-guard-view-processed-files.service'
import { PayrollManagementComponent } from '../../../Modules/WPSPayroll/WPSPayrollManagement/wpspayroll-management.component'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
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
    path: 'manage-employees',
    canLoad: [AuthGuardManageEmployees],
    loadChildren: () =>
      import('./ManageEmployees/manage-employees.module').then(
        (m) => m.ManageEmployeesModule,
      ),
  },
  {
    path: 'salary-payments',
    canLoad: [AuthGuardSalaryPayments],
    loadChildren: () =>
      import('./SalaryPayments/salary-payments.module').then(
        (m) => m.SalaryPaymentsModule,
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
    path: 'employee-upload-file',
    canLoad: [AuthGuardFileUpload],
    loadChildren: () =>
      import('./FileUpload/file-upload.module').then((m) => m.FileUploadModule),
    data: { type: 'employee' },
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
    path: 'request-status',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
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
  {
    path: 'download-templates',
    canLoad: [AuthGuardDownloadTemplates],
    loadChildren: () =>
      import('./DownloadTemplates/download-templates.module').then(
        (m) => m.DownloadTemplatesModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollManagementRoutingModule {}
