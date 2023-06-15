import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { UploadfileRoutingModule } from './uploadfile-routing.module'
import { UploadFileComponent } from './upload-file.component'
import { FileUploadStep1Component } from './upload-file-step1.component'
import { FileUploadStep2Component } from './upload-file-step2.component'
import { FileUploadStep3Component } from './upload-file-step3.component'
import { DuplicateBulkPayment } from './duplicate-bulkPayment.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    UploadFileComponent,
    FileUploadStep1Component,
    FileUploadStep2Component,
    FileUploadStep3Component,
    DuplicateBulkPayment,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    UploadfileRoutingModule,
    SharedModule,
  ],
})
export class UploadfileModule {}
