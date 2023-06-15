import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { RequestStatusRoutingModule } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/request-status-routing.module'
import { RequestStatusComponent } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/request-status.component'
import { RequestStatusService } from './request-status.service'
import { RequestReactivateStep1Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateService } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivate/request-reactivate.service'
import { RequestReactivateFileStep1Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivateFile/request-reactivate-file-step1.component'
import { RequestReactivateFileStep2Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivateFile/request-reactivate-file-step2.component'
import { RequestReactivateFileStep3Component } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivateFile/request-reactivate-file-step3.component'
import { RequestReactivateFileComponent } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivateFile/request-reactivate-file.component'
import { RequestReactivateFileService } from '../../../../Modules/Payroll/PayrollManagement/RequestStatus/reactivateFile/request-reactivate-file.service'

@NgModule({
  imports: [
    AppSharedModule,
    RequestStatusRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    RequestStatusComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
    RequestReactivateFileComponent,
    RequestReactivateFileStep1Component,
    RequestReactivateFileStep2Component,
    RequestReactivateFileStep3Component,
    RequestReactivateComponent,
  ],
  providers: [
    RequestStatusService,
    RequestReactivateService,
    RequestReactivateFileService,
  ],
})
export class RequestStatusModule {}
