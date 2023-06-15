import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NewPaymentGuard } from './Guard/new-payment.guard'
import { PreviousPaymentGuard } from './Guard/previous-payment.guard'
import { RequestStatusGuard } from './Guard/request-status.guard'
import { UploadFileComponent } from './Components/UploadFile/upload-file.component'
import { UploadFileGuard } from './Guard/upload-file.guard'
import { PreviousPaymentsComponent } from './Components/PreviousPayments/previous-payments.component'
import { GovernmentRevenueComponent } from './Components/government-revenue.component'
import { GovernmentRevenueOptionsComponent } from './Components/government-revenue-options.component'
import { RequestStatusComponent } from './Components/RequestStatus/request-status.component'
import { FileUploadRequestStatusDetailsComponent } from './Components/RequestStatus/detailsbatch/upload-file-details.component'
import { ProcessedOperationComponent } from './Components/ProcessedOperations/processed-operation.component'
import { GovernmentRevenueProcessedOperationDetailComponent } from './Components/ProcessedOperations/details/government-revenue-processed-operation-detail.component'
import { RequestReactivateComponent } from './Components/RequestStatus/RequestReactivate/request-reactivate.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'options',
    pathMatch: 'full',
  },
  {
    path: 'new-payment',
    component: GovernmentRevenueComponent,
    canLoad: [NewPaymentGuard],
  },
  {
    path: 'upload-file',
    component: UploadFileComponent,
    canLoad: [UploadFileGuard],
},
  {
    path: 'previous-payments',
    component: PreviousPaymentsComponent,
    canLoad: [PreviousPaymentGuard],
  },
  {
    path: 'payment-from-previous',
    component: GovernmentRevenueComponent,
    canLoad: [PreviousPaymentGuard],
  },
  {
    path: 'request-status',
    component: RequestStatusComponent,
    canLoad: [RequestStatusGuard],
  },
  {
    path: 'request-status/reactivate',
    component: RequestReactivateComponent,
    canLoad: [RequestStatusGuard],
  },
  {
    path: 'request-status/bulk-upload-details',
    component: FileUploadRequestStatusDetailsComponent,
    canLoad: [RequestStatusGuard],
  },
  {
    path: 'options',
    //canLoad: [RequestStatusGuard],
    component: GovernmentRevenueOptionsComponent,
  },
  {
    path: 'processed-operation',
    component: ProcessedOperationComponent,
  },
  {
    path: 'processed-operation/details',
    component: GovernmentRevenueProcessedOperationDetailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GovernmentRevenueRoutingModule {}
