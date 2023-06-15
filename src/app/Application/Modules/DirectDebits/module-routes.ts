import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { DirectDebitsOptionsComponent } from './direct-debits-options.component'
import { AuthGuardDirectDebitsPayments } from './DirectDebitsPayment/auth-guard-direct-debits-payments.service'
import { AuthGuardFileUpload } from './FileUpload/auth-guard-file-upload.service'
import { AuthGuardManagePayer } from './ManagePayer/auth-guard-manage-payer.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardViewProcessedFiles } from './ViewProcessedFiles/auth-guard-view-processed-files.service'

export const routes: Routes = [
  {
    path: '',
    component: DirectDebitsOptionsComponent,
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuardDashboard],
    loadChildren: () =>
      import('./Dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'manage-payer',
    canLoad: [AuthGuardManagePayer],
    loadChildren: () =>
      import('./ManagePayer/manage-payer.module').then(
        (m) => m.ManagePayerModule,
      ),
    data: { type: 'payer' },
  },
  {
    path: 'manage-direct-debits',
    canLoad: [AuthGuardDirectDebitsPayments],
    loadChildren: () =>
      import('./DirectDebitsPayment/direct-debits-payments.module').then(
        (m) => m.DirectDebitsPaymentsModule,
      ),
    data: { type: 'directDebit' },
  },
  {
    path: 'direct-debit-upload-file',
    canLoad: [AuthGuardFileUpload],
    loadChildren: () =>
      import('./FileUpload/file-upload.module').then((m) => m.FileUploadModule),
    data: { type: 'directDebit' },
  },
  {
    path: 'payer-upload-file',
    canLoad: [AuthGuardFileUpload],
    loadChildren: () =>
      import('./FileUpload/file-upload.module').then((m) => m.FileUploadModule),
    data: { type: 'payer' },
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectDebitsRoutingModule {}
