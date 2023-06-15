import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FinancProductNewRequestComponent } from './finance-product-new-request.component'

const routes: Routes = [
  {
    path: '',
    component: FinancProductNewRequestComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceProductNewRequestRoutingModule {}
