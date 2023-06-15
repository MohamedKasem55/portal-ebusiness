import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestStatusComponent } from '../../../../Modules/Payroll/PayrollCards/RequestStatus/request-status.component'
import { CardOperationComponent } from './Components/CardOperation/card-operation.component'
import { RequestReactivateOperationComponent } from './Components/CardOperation/reactivate/request-reactivate.component'
import { CardPaymentsComponent } from './Components/CardPayments/card-payments.component'
import { RequestReactivatePaymentComponent } from './Components/CardPayments/reactivate/request-reactivate.component'
import { RequestReactivateNewCardComponent } from './Components/RequestNewCardsOnline/reactivate/request-reactivate.component'
import { RequestNewCardsOnlineComponent } from './Components/RequestNewCardsOnline/request-new-cards-online.component'
import { RequestReactivateUploadFileComponent } from './Components/UploadFiles/reactivate/request-reactivate.component'
import { UploadFilesComponent } from './Components/UploadFiles/upload-files.component'

const routes: Routes = [
  { path: '', component: RequestStatusComponent },
  { path: 'card-payments', component: CardPaymentsComponent },
  { path: 'upload-files', component: UploadFilesComponent },
  { path: 'card-operation', component: CardOperationComponent },
  {
    path: 'request-new-card-online',
    component: RequestNewCardsOnlineComponent,
  },
  {
    path: 'card-payments/activate',
    component: RequestReactivatePaymentComponent,
  },
  {
    path: 'card-operation/activate',
    component: RequestReactivateOperationComponent,
  },
  {
    path: 'request-new-card-online/activate',
    component: RequestReactivateNewCardComponent,
  },
  {
    path: 'upload-files/activate',
    component: RequestReactivateUploadFileComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestStatusRoutingModule {}
