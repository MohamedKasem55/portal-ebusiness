import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CashManagementPoolingGuard } from './cash-management-pooling.guard'
import { CashManagementPoolingDetailComponent } from './components/detail/cash-management-pooling-detail.component'
import { CashManagementPoolingListComponent } from './components/list/cash-management-pooling-list.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [CashManagementPoolingGuard],
    component: CashManagementPoolingListComponent,
  },
  {
    path: 'detail',
    canLoad: [CashManagementPoolingGuard],
    component: CashManagementPoolingDetailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
