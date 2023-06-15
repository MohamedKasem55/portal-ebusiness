import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ModuleRoutingModule } from './module-routing.module'
import { ModuleService } from './module-service'
import { ModuleComponent } from './module.component'

@NgModule({
  imports: [AppSharedModule, ModuleRoutingModule],
  declarations: [ModuleComponent],
  providers: [ModuleService],
})
export class DownloadTemplatesModule {}
