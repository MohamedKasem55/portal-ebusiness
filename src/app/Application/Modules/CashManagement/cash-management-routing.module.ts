import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ReportsComponent } from './Reports/reports.component'

export const routes: Routes = [
  {
    path: 'sweeping',
    loadChildren: () =>
      import('./Sweeping/module-module').then((m) => m.ModuleManagementModule),
  },
  {
    path: 'pooling',
    loadChildren: () =>
      import('./Pooling/module-module').then((m) => m.ModuleManagementModule),
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashManagementRoutingModule {}
