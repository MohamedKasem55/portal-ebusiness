import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { RequestReactivateStep1Component } from './reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateService } from './reactivate/request-reactivate.service'
import { RequestReactivateFileStep1Component } from './reactivateFile/request-reactivate-file-step1.component'
import { RequestReactivateFileStep2Component } from './reactivateFile/request-reactivate-file-step2.component'
import { RequestReactivateFileStep3Component } from './reactivateFile/request-reactivate-file-step3.component'
import { RequestReactivateFileComponent } from './reactivateFile/request-reactivate-file.component'
import { RequestReactivateFileService } from './reactivateFile/request-reactivate-file.service'
import { RequestStatusRoutingModule } from './request-status-routing.module'
import { RequestStatusComponent } from './request-status.component'
import { RequestStatusService } from './request-status.service'

@NgModule({
  imports: [
    AppSharedModule,
    RequestStatusRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
    RequestReactivateFileComponent,
    RequestReactivateFileStep1Component,
    RequestReactivateFileStep2Component,
    RequestReactivateFileStep3Component,
  ],
  providers: [
    RequestReactivateService,
    RequestReactivateFileService,
    RequestStatusService,
  ],
})
export class RequestStatusModule {}
