import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardCardInquiries } from './CardInquiries/auth-guard-card-inquiries.service'
import { AuthGuardCardListReports } from './CardListReports/auth-guard-card-list-reports.service'
import { AuthGuardCardOperations } from './CardOperations/auth-guard-card-operations.service'
import { AuthGuardCardPayments } from './CardPayments/auth-guard-card-payments.service'
import { AuthGuardDownloadTemplates } from './DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFeedbackFiles } from './FeedbackFiles/auth-guard-feedback-files.service'
import { PayrollCardsComponent } from './payroll-cards.component'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardUploadFile } from './UploadFile/auth-guard-upload-file.service'
import { AuthGuardViewSentFiles } from './ViewSentFiles/auth-guard-view-sent-files.service'

const routes: Routes = [
  {
    path: '',
    component: PayrollCardsComponent,
  },
  {
    path: 'card-inquiries',
    canLoad: [AuthGuardCardInquiries],
    loadChildren: () =>
      import('./CardInquiries/card-inquiries.module').then(
        (m) => m.CardInquiriesModule,
      ),
  },
  {
    path: 'card-operations',
    canLoad: [AuthGuardCardOperations],
    loadChildren: () =>
      import('./CardOperations/card-operations.module').then(
        (m) => m.CardOperationsModule,
      ),
  },
  {
    path: 'card-payments',
    canLoad: [AuthGuardCardPayments],
    loadChildren: () =>
      import('./CardPayments/card-payments.module').then(
        (m) => m.CardPaymentsModule,
      ),
  },
  {
    path: 'upload-file',
    canLoad: [AuthGuardUploadFile],
    loadChildren: () =>
      import('./UploadFile/upload-file.module').then((m) => m.UploadFileModule),
  },
  {
    path: 'view-sent-files',
    canLoad: [AuthGuardViewSentFiles],
    loadChildren: () =>
      import('./ViewSentFiles/view-sent-files.module').then(
        (m) => m.ViewSentFilesModule,
      ),
  },
  {
    path: 'feedback-files',
    canLoad: [AuthGuardFeedbackFiles],
    loadChildren: () =>
      import('./FeedbackFiles/feedback-files.module').then(
        (m) => m.FeedbackFilesModule,
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
    path: 'card-list-reports',
    canLoad: [AuthGuardCardListReports],
    loadChildren: () =>
      import('./CardListReports/card-list-reports.module').then(
        (m) => m.CardListReportsModule,
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
export class PayrollCardsRoutingModule {}
