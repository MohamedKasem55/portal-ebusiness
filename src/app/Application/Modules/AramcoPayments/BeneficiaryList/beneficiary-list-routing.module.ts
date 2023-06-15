import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuardNewPayment } from './components/payment/auth-guard-new-payment.service'

import { BeneficiaryComponent } from './beneficiary.component'
import { DeleteComponent } from './components/delete/delete.component'
import { DetailComponent } from './components/details/detail.component'
import { ListComponent } from './components/list/list.component'
import { Step2Component } from './components/payment/components/Step2/step2.component'
import { Step3Component } from './components/payment/components/Step3/step3.component'
import { Step4Component } from './components/payment/components/Step4/step4.component'
import { NewPaymentComponent } from './components/payment/new-payment.component'

const routes: Routes = [
  {
    path: '',
    component: BeneficiaryComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ListComponent,
      },
      {
        path: 'payment',
        component: ListComponent,
      },
      {
        path: 'details',
        component: DetailComponent,
      },
      {
        path: 'delete',
        component: DeleteComponent,
      },
      {
        path: 'new-payment',
        canLoad: [AuthGuardNewPayment],
        component: NewPaymentComponent,
        children: [
          {
            path: '',
            redirectTo: 'step2',
            pathMatch: 'full',
          },
          {
            path: 'step2',
            component: Step2Component,
          },
          {
            path: 'step3',
            component: Step3Component,
          },
          {
            path: 'step4',
            component: Step4Component,
          },
        ],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiaryListRoutingModule {}
