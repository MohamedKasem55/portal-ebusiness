import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { AramcoPaymentsTableComponent } from './common/aramco-payments-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { PaymentsRoutingModule } from './payments-routing.module'
import { PaymentsComponent } from './payments.component'
import { PaymentsService } from './payments.service'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    PaymentsRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    PaymentsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    AramcoPaymentsTableComponent,
  ],
  providers: [PaymentsService, LevelFormatPipe],
})
export class PaymentsModule {}
