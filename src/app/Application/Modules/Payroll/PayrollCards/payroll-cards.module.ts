import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardCardInquiries } from './CardInquiries/auth-guard-card-inquiries.service'
import { AuthGuardCardListReports } from './CardListReports/auth-guard-card-list-reports.service'
import { AuthGuardCardOperations } from './CardOperations/auth-guard-card-operations.service'
import { AuthGuardCardPayments } from './CardPayments/auth-guard-card-payments.service'
import { AuthGuardDownloadTemplates } from './DownloadTemplates/auth-guard-download-templates.service'
import { AuthGuardFeedbackFiles } from './FeedbackFiles/auth-guard-feedback-files.service'
import { PayrollCardsRoutingModule } from './payroll-cards-routing.module'
import { PayrollCardsComponent } from './payroll-cards.component'
import { PayrollCardsService } from './payroll-cards.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardUploadFile } from './UploadFile/auth-guard-upload-file.service'
import { AuthGuardViewSentFiles } from './ViewSentFiles/auth-guard-view-sent-files.service'

@NgModule({
  imports: [AppSharedModule, PayrollCardsRoutingModule],
  declarations: [PayrollCardsComponent],
  exports: [PayrollCardsComponent],
  providers: [
    PayrollCardsService,
    AuthGuardCardInquiries,
    AuthGuardCardOperations,
    AuthGuardCardPayments,
    AuthGuardUploadFile,
    AuthGuardViewSentFiles,
    AuthGuardFeedbackFiles,
    AuthGuardDownloadTemplates,
    AuthGuardCardListReports,
    AuthGuardRequestStatus,
  ],
})
export class PayrollCardsModule {}
