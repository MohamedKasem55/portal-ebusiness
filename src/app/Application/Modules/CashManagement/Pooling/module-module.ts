import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { CashManagementPoolingDetailComponent } from './components/detail/cash-management-pooling-detail.component'
import { CashManagementPoolingDetailService } from './components/detail/cash-management-pooling-detail.service'
import { CashManagementPoolingListComponent } from './components/list/cash-management-pooling-list.component'
import { CashManagementPoolingListService } from './components/list/cash-management-pooling-list.service'
import { ModuleRoutingModule } from './module-routes'

@NgModule({
  declarations: [
    CashManagementPoolingListComponent,
    CashManagementPoolingDetailComponent,
  ],
  imports: [ModuleRoutingModule, CommonModule, AppSharedModule],
  providers: [
    CashManagementPoolingListService,
    CashManagementPoolingDetailService,
  ],
  exports: [],
})
export class ModuleManagementModule {}
