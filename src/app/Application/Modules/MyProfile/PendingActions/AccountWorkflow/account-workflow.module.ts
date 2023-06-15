import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { AccountWorkflowRoutingModule } from './account-workflow-routing.module'
import { AccountWorkflowComponent } from './account-workflow.component'
import { AccountWorkflowGuard } from './account-workflow.guard'
import { AccountWorkflowService } from './account-workflow.service'
import { AccountWorkflowTableLevelsComponent } from './components/common/account-workflow-table-levels.component'
import { AccountWorkflowTableComponent } from './components/common/account-workflow-table.component'
import { NonFinancialWorkflowTableLevelsComponent } from './components/common/nonFinancial-workflow-table-levels.component'
import { NonFinancialWorkflowTableComponent } from './components/common/nonFinancial-workflow-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'

@NgModule({
  imports: [AppSharedModule, AccountWorkflowRoutingModule],
  declarations: [
    AccountWorkflowComponent,
    AccountWorkflowTableLevelsComponent,
    NonFinancialWorkflowTableLevelsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    AccountWorkflowTableComponent,
    NonFinancialWorkflowTableComponent,
  ],
  providers: [AccountWorkflowService, AccountWorkflowGuard],
})
export class AccountWorkflowModule {}
