import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ChartsModule } from 'ng2-charts'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AuthGuardDashboard } from './Dashboard/auth-guard-dashboard.service'
import { DirectDebitsOptionsComponent } from './direct-debits-options.component'
import { AuthGuardDirectDebitsPayments } from './DirectDebitsPayment/auth-guard-direct-debits-payments.service'
import { AuthGuardFileUpload } from './FileUpload/auth-guard-file-upload.service'
import { AuthGuardManagePayer } from './ManagePayer/auth-guard-manage-payer.service'
import { DirectDebitsRoutingModule } from './module-routes'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AuthGuardViewProcessedFiles } from './ViewProcessedFiles/auth-guard-view-processed-files.service'

@NgModule({
  declarations: [DirectDebitsOptionsComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    DirectDebitsRoutingModule,
  ],
  providers: [
    AuthGuardFileUpload,
    AuthGuardRequestStatus,
    AuthGuardViewProcessedFiles,
    AuthGuardManagePayer,
    AuthGuardDirectDebitsPayments,
    AuthGuardDashboard,
  ],
  exports: [DirectDebitsOptionsComponent],
})
export class ModuleImpl {}
