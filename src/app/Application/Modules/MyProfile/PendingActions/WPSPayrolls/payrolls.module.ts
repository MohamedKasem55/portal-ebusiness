import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { PayrollsRoutingModule } from './payrolls-routing.module'
import { PayrollsComponent } from './payrolls.component'
import { PayrollsService } from './payrolls.service'
import { PayrollswpsGuard } from './payrollswps.guard'
import { ExportPaWpsPayrollComponent } from './components/export/export-pa-wps-payroll.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    PayrollsRoutingModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    PayrollsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    ExportPaWpsPayrollComponent,
  ],
  providers: [PayrollsService, PayrollswpsGuard],
})
export class WPSPayrollsModule {}
