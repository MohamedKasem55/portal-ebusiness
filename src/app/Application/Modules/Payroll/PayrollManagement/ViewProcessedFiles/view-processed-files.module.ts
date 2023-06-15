import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ViewProcessedFilesRoutingModule } from './view-processed-files-routing.module'
// General service to optain static data
import { ViewProcessedFilesService } from './view-processed-files-service'
import { ViewProcessedFilesComponent } from './view-processed-files.component'
import { ExportProcessedFileComponent } from './export/export-processed-file.component'
import { ModelPipe } from '../../../../Components/common/Pipes/model-pipe'

@NgModule({
  imports: [
    AppSharedModule,
    ViewProcessedFilesRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
  ],
  declarations: [ViewProcessedFilesComponent, ExportProcessedFileComponent],
  providers: [ViewProcessedFilesService, ModelPipe],
})
export class ViewProcessedFilesModule {}
