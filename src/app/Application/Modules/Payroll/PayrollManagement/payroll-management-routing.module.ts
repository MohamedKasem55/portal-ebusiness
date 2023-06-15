import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardDashboard } from '../../../Modules/Payroll/PayrollManagement/Dashboard/auth-guard-dashboard.service'
import { AuthGuardDownloadTemplates } from '../../../Modules/Payroll/PayrollManagement/DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFileUpload } from '../../../Modules/Payroll/PayrollManagement/FileUpload/auth-guard-file-upload.service'
import { AuthGuardManageEmployees } from '../../../Modules/Payroll/PayrollManagement/ManageEmployees/auth-guard-manage-employees.service'
import { PayrollManagementComponent } from '../../../Modules/Payroll/PayrollManagement/payroll-management.component'
import { AuthGuardRequestStatus } from '../../../Modules/Payroll/PayrollManagement/RequestStatus/auth-guard-request-status.service'
import { AuthGuardSalaryPayments } from '../../../Modules/Payroll/PayrollManagement/SalaryPayments/auth-guard-salary-payments.service'
import { AuthGuardViewProcessedFiles } from '../../../Modules/Payroll/PayrollManagement/ViewProcessedFiles/auth-guard-view-processed-files.service'

const routes: Routes = [
  {
    path: '',
    component: PayrollManagementComponent,
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
    path: 'download-templates',
    canLoad: [AuthGuardDownloadTemplates],
    loadChildren: () =>
      import('./DownloadTemplates/download-templates.module').then(
        (m) => m.DownloadTemplatesModule,
      ),
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuardDashboard],
    loadChildren: () =>
      import('./Dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollManagementRoutingModule {}
