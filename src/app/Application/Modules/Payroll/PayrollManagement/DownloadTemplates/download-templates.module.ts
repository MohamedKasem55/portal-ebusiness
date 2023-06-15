import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { DownloadTemplatesService } from './download-templates.service'
import { ModuleRoutingModule } from './module-routing.module'
import { ModuleComponent } from './module.component'

@NgModule({
  imports: [AppSharedModule, ModuleRoutingModule],
  declarations: [ModuleComponent],
  providers: [DownloadTemplatesService],
})
export class DownloadTemplatesModule {}
