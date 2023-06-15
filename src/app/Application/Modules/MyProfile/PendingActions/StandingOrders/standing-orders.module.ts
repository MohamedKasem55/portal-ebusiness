import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { StandingOrderTableComponent } from './common/standing-order-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { StandingOrdersRoutingModule } from './standing-orders-routing.module'
import { StandingOrdersComponent } from './standing-orders.component'
import { StandingOrdersGuard } from './standing-orders.guard'
import { StandingOrdersService } from './standing-orders.service'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    StandingOrdersRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    StandingOrderTableComponent,
    StandingOrdersComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [StandingOrdersService, StandingOrdersGuard],
})
export class StandingOrdersModule {}
