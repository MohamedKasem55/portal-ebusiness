import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SalaryPaymentsRoutingModule } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments-routing.module'
import { SalaryPaymentsStep1Component } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments-step1.component'
import { SalaryPaymentsStep2Component } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments-step2.component'
import { SalaryPaymentsStep3Component } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments-step3.component'
import { SalaryPaymentsComponent } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments.component'
import { SalaryPaymentsService } from '../../../../Modules/Payroll/PayrollManagement/SalaryPayments/salary-payments.service'

@NgModule({
  imports: [
    AppSharedModule,
    ReactiveFormsModule,
    SalaryPaymentsRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    SalaryPaymentsComponent,
    SalaryPaymentsStep1Component,
    SalaryPaymentsStep2Component,
    SalaryPaymentsStep3Component,
  ],
  providers: [SalaryPaymentsService],
})
export class SalaryPaymentsModule {}
