import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { FileUploadEmployeeStep2Component } from './file-upload-employee-step2.component'
import { FileUploadRoutingModule } from './file-upload-routing.module'
import { FileUploadStep1Component } from './file-upload-step1.component'
import { FileUploadStep2Component } from './file-upload-step2.component'
import { FileUploadStep3Component } from './file-upload-step3.component'
import { FileUploadComponent } from './file-upload.component'
import { FileUploadService } from './file-upload.service'
import { DuplicateWpsPayrollFileComponent } from './duplicate-wps-payrollFile.component'

@NgModule({
  imports: [AppSharedModule, FileUploadRoutingModule],
  declarations: [
    FileUploadComponent,
    FileUploadStep1Component,
    FileUploadStep2Component,
    FileUploadEmployeeStep2Component,
    FileUploadStep3Component,
    DuplicateWpsPayrollFileComponent,
  ],
  providers: [FileUploadService],
})
export class FileUploadModule {}
