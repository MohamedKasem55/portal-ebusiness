import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrePaidCardRequestComponent } from './pre-paid-card-request.component'
import { PrePaidCardRequestStep1Component } from './pre-paid-card-request-step1.component'
import { PrePaidCardRequestStep3Component } from './pre-paid-card-request-step3.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardRequestComponent,
    children: [
      {
        path: '',
        redirectTo: 'step1',
        pathMatch: 'full',
      },
      {
        path: 'step1',
        component: PrePaidCardRequestStep1Component,
      },
      {
        path: 'step3',
        component: PrePaidCardRequestStep3Component,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrePaidCardRoutes {}
