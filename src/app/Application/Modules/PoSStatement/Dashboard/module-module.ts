import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
// Services
import { AuthGuardDashboard } from './auth-guard-dashboard.service'
import { DashboardComponent } from './dashboard.component'
import { DashboardService } from './dashboard.service'
import { DashboardRoutingModule } from './module-routes'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    DashboardRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [DashboardService, AuthGuardDashboard],
  exports: [DashboardComponent],
})
export class DashboardModuleImpl {}
