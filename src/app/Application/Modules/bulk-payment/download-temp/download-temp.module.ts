import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { DownloadTempRoutingModule } from './download-temp-routing.module'
import { DownloadTemplateComponent } from './downloadTemplate.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { SharedModule } from '../../shared/shared.module'
import { DownloadTemplatesService } from './download-templates.service'

@NgModule({
  declarations: [DownloadTemplateComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    DownloadTempRoutingModule,
    SharedModule,
  ],
  providers: [DownloadTemplatesService],
})
export class DownloadTempModule {}
