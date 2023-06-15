import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { Step4Component } from './components/Step4/step4.component'
import { MultiPaymentComponent } from './multi-payment.component'

const routes: Routes = [
  {
    path: '',
    component: MultiPaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'step1',
        pathMatch: 'full',
      },
      {
        path: 'step1',
        component: Step1Component,
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiPaymentRoutingModule {}
