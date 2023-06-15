import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { CashManagementSweepingDetailComponent } from './components/detail/cash-management-sweeping-detail.component'
import { CashManagementSweepingDetailService } from './components/detail/cash-management-sweeping-detail.service'
import { CashManagementSweepingListComponent } from './components/list/cash-management-sweeping-list.component'
import { CashManagementSweepingListService } from './components/list/cash-management-sweeping-list.service'
import { ModuleRoutingModule } from './module-routes'

@NgModule({
  declarations: [
    CashManagementSweepingListComponent,
    CashManagementSweepingDetailComponent,
  ],
  imports: [ModuleRoutingModule, CommonModule, AppSharedModule],
  providers: [
    CashManagementSweepingListService,
    CashManagementSweepingDetailService,
  ],
  exports: [],
})
export class ModuleManagementModule {}
