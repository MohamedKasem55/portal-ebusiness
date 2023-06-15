import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../../core/shared/shared.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NewProductRoutingModule } from './newProduct-routing.module';
import { WpsPayrollNewComponent } from './WpsPayrollNew/wps-payroll-new.component';
import { WpsPayrollNewComponentStep1 } from './WpsPayrollNew/WpsPayrollNewStep1/wps-payroll-new-step1.component';
import { WpsPayrollService } from './WpsPayrollNew/wps-payroll-new.service';
import { WpsPayrollNewComponentStep2 } from './WpsPayrollNew/WpsPayrollNewStep2/wps-payroll-new-step2.component';
import { WpsPayrollNewComponentStep3 } from './WpsPayrollNew/WpsPayrollNewStep3/wps-payroll-new-step3.component';
import { WpsRequestStatusComponent } from './WpsRequestStatus/wps-request-status.component';
import { WpsRequestStatus } from './WpsRequestStatus/wps-request-status.service';
import { WpsRequestDetailsComponent } from './WpsRequestDetails/wps-request-details.component';

@NgModule({
  declarations: [
    WpsPayrollNewComponent,
    WpsPayrollNewComponentStep1,
    WpsPayrollNewComponentStep2,
    WpsPayrollNewComponentStep3,
    WpsRequestStatusComponent,
    WpsRequestDetailsComponent,
  ],
  imports: [
CommonModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NewProductRoutingModule,
  ],
  providers: [
    WpsPayrollService,
    WpsRequestStatus,
  ],
  exports: [],
})
export class NewProductModule {
}