import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { DownloadMolFileComponent } from './download-mol-file.component'
import { DownloadMolFileService } from './download-mol-file.service'
import { ModuleRoutingModule } from './module-routing.module'

@NgModule({
  imports: [
    AppSharedModule,
    ModuleRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
  ],
  declarations: [DownloadMolFileComponent],
  providers: [DownloadMolFileService],
})
export class DownloadMolFileModule {}
