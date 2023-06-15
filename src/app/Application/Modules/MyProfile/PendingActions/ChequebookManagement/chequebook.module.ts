import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ChequebookRoutingModule } from './chequebook-routing.module'
import { ChequebookComponent } from './chequebook.component'
import { ChequebookGuard } from './chequebook.guard'
import { ChequebookService } from './chequebook.service'
import { ChequeCreateTableComponent } from './common/cheque-create-table.component'
import { ChequePositivePayTableComponent } from './common/cheque-positive-pay-table.component'
import { ChequeStopTableComponent } from './common/cheque-stop-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { AppSharedModuleWithoutValidator } from '../../../../../core/shared/shared-without-validator.module'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    ChequebookRoutingModule,
    AppSharedModuleWithoutValidator,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    ChequebookComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    ChequeCreateTableComponent,
    ChequeStopTableComponent,
    ChequePositivePayTableComponent,
  ],
  providers: [ChequebookService, ChequebookGuard],
})
export class ChequebookModule {}
