import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { FileUploadPayerStep2Component } from './file-upload-payer-step2.component'
import { FileUploadRoutingModule } from './file-upload-routing.module'
import { FileUploadStep1Component } from './file-upload-step1.component'
import { FileUploadStep2Component } from './file-upload-step2.component'
import { FileUploadStep3Component } from './file-upload-step3.component'
import { FileUploadComponent } from './file-upload.component'
import { FileUploadService } from './file-upload.service'

@NgModule({
  imports: [AppSharedModule, FileUploadRoutingModule],
  declarations: [
    FileUploadComponent,
    FileUploadStep1Component,
    FileUploadStep2Component,
    FileUploadPayerStep2Component,
    FileUploadStep3Component,
  ],
  providers: [FileUploadService],
})
export class FileUploadModule {}
