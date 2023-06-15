import { DatePipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component'
import { DashboardService } from './dashboard.service'

@NgModule({
  imports: [
    AppSharedModule,
    DashboardRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [DashboardComponent],
  providers: [DashboardService, DatePipe],
})
export class DashboardModule {}
