import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DetailsUploadedFilesComponent } from './DetailsFiles/details-uploaded-files.component'
import { FeedbackFilesOptionsComponent } from './feedback-files-Options.component'
import { FeedbackFilesViewCardPaymentsComponent } from './feedback-files-ViewCardPayments.component'
import { FeedbackFilesViewDownloadWpsComponent } from './feedback-files-ViewDownloadWps.component'
import { FeedbackFilesViewOnlineRequestComponent } from './feedback-files-ViewOnlineRequests.component'
import { FeedbackFilesViewUploadComponent } from './feedback-files-ViewUpload.component'

const routes: Routes = [
  {
    path: '',
    component: FeedbackFilesOptionsComponent,
  },
  { path: 'feedBackFilesOptions', component: FeedbackFilesOptionsComponent },
  {
    path: 'feedBackFilesViewOnlineRequest',
    component: FeedbackFilesViewOnlineRequestComponent,
  },
  {
    path: 'feedBackFilesViewUploadFiles',
    component: FeedbackFilesViewUploadComponent,
  },
  {
    path: 'feedBackFilesViewDownloadWps',
    component: FeedbackFilesViewDownloadWpsComponent,
  },
  {
    path: 'feedBackFilesViewCardPayments',
    component: FeedbackFilesViewCardPaymentsComponent,
  },
  {
    path: 'details-file',
    component: DetailsUploadedFilesComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackFilesRoutingModule {}
