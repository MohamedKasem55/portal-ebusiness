import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FinanceProductDetailsComponent } from './finance-product-details.component'
import { LoanExecutionComponent } from './LoanExecution/loan-execution.component'

const routes: Routes = [
  {
    path: '',
    component: FinanceProductDetailsComponent,
  },

  {
    path: 'execution',
    component: LoanExecutionComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceProductDetailsRoutingModule {}
