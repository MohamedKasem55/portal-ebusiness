import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RequestsRoutingModule } from 'app/Application/Modules/FinanceProduct/fleet/requests/requests-routing.module'
import { SummaryComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/extrenal-quotation/summary/summary.component'
import { ProductSelectComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/internal-quotation/product-select/product-select.component'
import { BreakdownComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/breakdown/breakdown.component'
import { FinishComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/finish/finish.component'
import { InternalRequestDetailsComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/internal-request-details/internal-request-details.component'
import { AddRequestWizardComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/add-request-wizard.component'
import { RequestDetailsComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/request-details/request-details.component'
import { MessageRequestComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/message-request/message-request.component'
import { OfferAcceptanceComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/offer-acceptance/offer-acceptance.component'
import { BranchSignatureComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/branch-signature/branch-signature.component'
import { LoanExecutionComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/loan-execution/loan-execution.component'
import { UploadDocsComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/upload-docs/upload-docs.component'
import { AllCompComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/all_components/all-comp.component'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { SharedModule } from 'app/Application/Modules/FinanceProduct/shared/shared.module'
import { AddRequestDetailsStep1Component } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/add-request-details-step1/add-request-details-step1.component'
import { BusinessDetailsStep1Component } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/business-details-step1/business-details-step1.component'
import { LinkedAccountStepComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/linked-account-step/linked-account-step.component'
import { ApplicationSummaryStepComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/application-summary-step/application-summary-step.component'
import { InitialOfferStepComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/initial-offer-step/initial-offer-step.component'
import { DocsStepComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/docs-step/docs-step.component'
import { DocumentationUploadComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/components/documentation-upload/documentation-upload.component';
import { FinalOfferComponent } from './pages/final_request/final-offer/final-offer.component';
import { ResultComponent } from './pages/final_request/result/result.component';
import { OfferRejectComponent } from './components/offer-reject/offer-reject.component';
import { InternalSummaryComponent } from './pages/add/internal-quotation/internal-summary/internal-summary.component';
import { TrackStatusComponent } from './pages/final_request/track-status/track-status.component';
import { InitialOfferApprovedComponent } from './components/initial-offer-approved/initial-offer-approved.component';
import { FinanceProductNewRequestService } from '../../pos/NewRequest/finance-product-new-request.service'
import { UploadComponent } from './pages/add/extrenal-quotation/upload/upload.component'

@NgModule({
  declarations: [
    SummaryComponent,
    ProductSelectComponent,
    BreakdownComponent,
    FinishComponent,
    InternalRequestDetailsComponent,
    UploadComponent,
    AddRequestWizardComponent,
    RequestDetailsComponent,
    MessageRequestComponent,
    OfferAcceptanceComponent,
    BranchSignatureComponent,
    LoanExecutionComponent,
    UploadDocsComponent,
    AllCompComponent,
    AddRequestDetailsStep1Component,
    BusinessDetailsStep1Component,
    LinkedAccountStepComponent,
    ApplicationSummaryStepComponent,
    InitialOfferStepComponent,
    DocsStepComponent,
    DocumentationUploadComponent,
    FinalOfferComponent,
    ResultComponent,
    OfferRejectComponent,
    InternalSummaryComponent,
    TrackStatusComponent,
    InitialOfferApprovedComponent,
  ],
  imports: [CommonModule, RequestsRoutingModule, AppSharedModule, SharedModule],
  providers:[FinanceProductNewRequestService]
})
export class RequestsModule {}
