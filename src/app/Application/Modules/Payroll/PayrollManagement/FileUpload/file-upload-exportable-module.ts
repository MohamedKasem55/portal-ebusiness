import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { DuplicatePayrollFileComponent } from './duplicate-payrollFile.component'

@NgModule({
  imports: [AppSharedModule],
  declarations: [
    DuplicatePayrollFileComponent
  ],
  exports:[DuplicatePayrollFileComponent]
})
export class FileUploadExportableModule {}
