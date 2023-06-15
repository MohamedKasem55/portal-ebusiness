import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'

import { DownloadTemplatesService } from './download-templates.service'
import { DownloadTemplatesRoutingModule } from './download-templates-routing.module'
import { DownloadTemplatesComponent } from './download-templates.component'

@NgModule({
  imports: [AppSharedModule, DownloadTemplatesRoutingModule],
  declarations: [DownloadTemplatesComponent],
  providers: [DownloadTemplatesService],
})
export class DownloadTemplatesModule {}
