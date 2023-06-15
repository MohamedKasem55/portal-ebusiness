import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FinanceProductDetailsGuard } from './Details/finance-product-details.guard'
import {FinanceProductNewRequestGuard} from "./pos/NewRequest/finance-product-new-request.guard";



export const routes: Routes = [
  {
    path: 'newRequest',
    canLoad: [FinanceProductNewRequestGuard],
    loadChildren: () =>
      import(
        './new-request/new-request.module'
      ).then((m) => m.NewRequestModule),
  },
  {
    path: 'details',
    canLoad: [FinanceProductDetailsGuard],
    loadChildren: () =>
      import('../FinanceProduct/Details/finance-product-details.module').then(
        (m) => m.FinanceProductDetailsModule,
      ),
  },
  {
    path: 'pos',
    canLoad: [FinanceProductDetailsGuard],
    loadChildren: () =>
      import('./pos/pos.module').then(
        (m) => m.POSModule,
      ),
  },
  {
    path: 'fleet',
    canLoad: [FinanceProductDetailsGuard],
    loadChildren: () =>
        import('app/Application/Modules/FinanceProduct/fleet/fleet.module').then(
            (m) => m.FleetModule,
        ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceProductRoutingModule {}
