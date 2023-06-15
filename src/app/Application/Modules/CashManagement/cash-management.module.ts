import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { CashManagementRoutingModule } from './cash-management-routing.module'
import { ReportsComponent } from './Reports/reports.component'
import { ReportsService } from './Reports/reports.service'

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    CashManagementRoutingModule,
    AppSharedModule,
  ],
  providers: [ReportsService],
})
export class CashManagementModule {}
