import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StopPaymentComponent } from './stop-payment.component'

const routes: Routes = [{ path: '', component: StopPaymentComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
