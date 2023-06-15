import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { routes } from './bulk-payment-routing.module'
import { BulkPaymentComponent } from './bulk-payment.component'
import { DownloadTempModule } from './download-temp/download-temp.module'
import { BulkPaymentGuard } from './bulk-payment.guard'
import { ReqStatusModule } from './req-status/req-status.module'
import { UploadfileModule } from './uploadfile/uploadfile.module'
import { ProcessedFileModule } from './processed-file/processed-file.module';
import { BulkPaymentSelfOnboardComponent } from './self-onboard/bulk-payment-self-onboard.component'

@NgModule({
  declarations: [BulkPaymentComponent, BulkPaymentSelfOnboardComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    UploadfileModule,
    ReqStatusModule,
    DownloadTempModule,
    ProcessedFileModule,
    RouterModule.forChild(routes),
  ],
  providers: [BulkPaymentGuard],
})
export class BulkPaymentModule {}
