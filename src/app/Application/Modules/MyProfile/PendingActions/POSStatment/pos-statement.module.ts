import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ClaimTableComponent } from './common/claim-table.component'
import { MaintenanceTableComponent } from './common/maintenance-table.component'
import { ManagementTableComponent } from './common/management-table.component'
import { NewRequestTableComponent } from './common/new-request-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { POSStatementRoutingModule } from './pos-statement-routing.module'
import { POSStatementComponent } from './pos-statement.component'
import { PosStatementGuard } from './pos-statement.guard'
import { POSStatementService } from './pos-statement.service'

@NgModule({
  imports: [AppSharedModule, POSStatementRoutingModule],
  declarations: [
    NewRequestTableComponent,
    MaintenanceTableComponent,
    ManagementTableComponent,
    ClaimTableComponent,
    POSStatementComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [POSStatementService, PosStatementGuard],
})
export class POSStatementModule {}
