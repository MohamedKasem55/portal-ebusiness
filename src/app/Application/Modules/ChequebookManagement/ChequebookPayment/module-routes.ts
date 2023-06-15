import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChequebookPaymentComponent } from './chequebook-payment.component'
import { NewInquiryComponent } from './NewInquiry/new-inquiry.component'

export const routes: Routes = [
  {
    path: '',
    component: ChequebookPaymentComponent,
  },
  {
    path: 'newInquiry',
    component: NewInquiryComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
