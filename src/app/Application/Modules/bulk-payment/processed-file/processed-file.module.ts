import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ProcessedFileRoutingModule } from './processed-file-routing.module'
import { ProcessedFileComponent } from './processed-file/processed-file.component'
import { ProcessedFileService } from './processed-file/processed-file.service'
import { ProcessedfileGuard } from './processedfile.guard'

@NgModule({
  imports: [
    CommonModule,
    ProcessedFileRoutingModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ProcessedFileComponent],
  providers: [ProcessedFileService, ProcessedfileGuard],
})
export class ProcessedFileModule {}
