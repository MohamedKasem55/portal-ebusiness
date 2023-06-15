import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SharedModule } from '../../../shared/shared.module'
import { PayrollCardsOperationsSelectedTableComponent } from './common/payrollCardsOperationsSelected-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { PayrollCardsRoutingModule } from './payroll-cards-routing.module'
import { PayrollCardsComponent } from './payroll-cards.component'
import { PayrollCardsGuard } from './payroll-cards.guard'
import { PayrollCardsService } from './payroll-cards.service'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { CommonModule } from '@angular/common'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    PayrollCardsRoutingModule,
    SharedModule,
    CommonModule,
    PendingActionsModule,
  ],
  declarations: [
    PayrollCardsComponent,
    PayrollCardsOperationsSelectedTableComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [PayrollCardsService, PayrollCardsGuard, LevelFormatPipe],
})
export class PayrollCardsModule {}
