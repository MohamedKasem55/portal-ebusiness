import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { FeedbackFilesRoutingModule } from '../../../../Modules/Payroll/PayrollCards/FeedbackFiles/feedback-files-routing.module'
import { DetailsUploadedFilesComponent } from './DetailsFiles/details-uploaded-files.component'
import { FeedbackFilesOptionsComponent } from './feedback-files-Options.component'
import { FeedbackFilesViewCardPaymentsComponent } from './feedback-files-ViewCardPayments.component'
import { FeedbackFilesViewDownloadWpsComponent } from './feedback-files-ViewDownloadWps.component'
import { FeedbackFilesViewOnlineRequestComponent } from './feedback-files-ViewOnlineRequests.component'
import { FeedbackFilesViewUploadComponent } from './feedback-files-ViewUpload.component'
//Service
import { FeedBackFilesService } from './feedback-files.service'

@NgModule({
  imports: [
    AppSharedModule,
    FeedbackFilesRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    FeedbackFilesOptionsComponent,
    FeedbackFilesViewOnlineRequestComponent,
    FeedbackFilesViewUploadComponent,
    FeedbackFilesViewDownloadWpsComponent,
    FeedbackFilesViewCardPaymentsComponent,
    DetailsUploadedFilesComponent,
  ],
  providers: [FeedBackFilesService],
})
export class FeedbackFilesModule {}
