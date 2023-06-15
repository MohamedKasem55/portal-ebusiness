import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CashManagementSweepingGuard } from './cash-management-sweeping.guard'
import { CashManagementSweepingDetailComponent } from './components/detail/cash-management-sweeping-detail.component'
import { CashManagementSweepingListComponent } from './components/list/cash-management-sweeping-list.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [CashManagementSweepingGuard],
    component: CashManagementSweepingListComponent,
  },
  {
    path: 'detail',
    canLoad: [CashManagementSweepingGuard],
    component: CashManagementSweepingDetailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
