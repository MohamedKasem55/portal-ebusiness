import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SharedModule } from '../../../shared/shared.module'
import { UploadFileRoutingModule } from './upload-file-routing.module'
import { UploadFileStep1Component } from './upload-file-step1.component'
import { UploadFileStep2Component } from './upload-file-step2.component'
import { UploadFileStep3Component } from './upload-file-step3.component'
import { UploadFileComponent } from './upload-file.component'
import { FileUploadService } from './upload-file.service'

@NgModule({
  imports: [AppSharedModule, UploadFileRoutingModule, SharedModule],
  declarations: [
    UploadFileComponent,
    UploadFileStep1Component,
    UploadFileStep2Component,
    UploadFileStep3Component,
  ],
  providers: [FileUploadService],
})
export class UploadFileModule {}
