import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { PayrollTableComponent } from './components/common/payroll-table.component'
import { SalaryPaymentTableComponent } from './components/common/salary-payment-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { PayrollsRoutingModule } from './payrolls-routing.module'
import { PayrollsComponent } from './payrolls.component'
import { PayrollsGuard } from './payrolls.guard'
import { PayrollsService } from './payrolls.service'
import { ExportPAPayrollComponent } from './components/export/export-pa-payroll.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'
@NgModule({
  imports: [
    AppSharedModule,
    PayrollsRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    PayrollsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    SalaryPaymentTableComponent,
    PayrollTableComponent,
    ExportPAPayrollComponent,
  ],
  providers: [PayrollsService, PayrollsGuard],
})
export class PayrollsModule {}
