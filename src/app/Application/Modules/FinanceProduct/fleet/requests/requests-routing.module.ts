import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AddRequestWizardComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/add-request-wizard.component'
import { BreakdownComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/breakdown/breakdown.component'
import { SummaryComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/extrenal-quotation/summary/summary.component'
import { UploadComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/extrenal-quotation/upload/upload.component'
import { ProductSelectComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/add/internal-quotation/product-select/product-select.component'
import { AllCompComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/all_components/all-comp.component'
import { InternalRequestDetailsComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/internal-request-details/internal-request-details.component'
import { RequestDetailsComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/request-details/request-details.component'
import { FinalOfferComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/final-offer/final-offer.component'
import { ResultComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/final_request/result/result.component'
import { InternalSummaryComponent } from './pages/add/internal-quotation/internal-summary/internal-summary.component'
import { TrackStatusComponent } from './pages/final_request/track-status/track-status.component'
import { FinishComponent } from './pages/add/finish/finish.component'

const routes: Routes = [
  { path: 'all_comp', component: AllCompComponent },
  { path: 'add-request', component: AddRequestWizardComponent },
  { path: 'internal-product-select', component: ProductSelectComponent },
  { path: 'application-details', component: RequestDetailsComponent },
  { path: 'initialOffer/breakdown', component: BreakdownComponent },
  { path: 'external-summary', component: SummaryComponent },
  { path: 'external-upload', component: UploadComponent },
  { path: 'final-offer', component: FinalOfferComponent },
  { path: 'result', component: ResultComponent },
  { path: 'internal-summary', component: InternalSummaryComponent },
  { path: 'track-status', component: TrackStatusComponent },
  { path: 'finish', component: FinishComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule {}
