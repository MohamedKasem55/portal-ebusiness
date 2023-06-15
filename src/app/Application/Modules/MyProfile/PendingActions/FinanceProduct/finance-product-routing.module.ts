import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FinanceProductComponent } from './finance-product.component'

const routes: Routes = [
  {
    path: '',
    component: FinanceProductComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceProductRoutingModule {}
