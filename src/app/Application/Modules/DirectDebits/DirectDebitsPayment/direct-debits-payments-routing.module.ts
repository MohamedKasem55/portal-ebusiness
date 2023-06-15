import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DirectDebitsPaymentsComponent } from './direct-debits-payments.component'

const routes: Routes = [
  {
    path: '',
    component: DirectDebitsPaymentsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectDebitsPaymentsRoutingModule {}
