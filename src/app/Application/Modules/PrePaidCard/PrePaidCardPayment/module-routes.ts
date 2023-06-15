import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrePaidCardPaymentComponent } from './prePaidCardPayment.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardPaymentComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
