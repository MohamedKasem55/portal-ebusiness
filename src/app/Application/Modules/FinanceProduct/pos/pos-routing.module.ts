import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceProductNewRequestGuard } from './NewRequest/finance-product-new-request.guard';

const routes: Routes = [
{
      path: '',
      loadChildren: () =>
        import(
          './NewRequest/finance-product-new-request.module'
        ).then((m) => m.FinancProductNewRequestModule),
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class POSRoutingModule { }
