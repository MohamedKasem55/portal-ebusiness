import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ViewSentFilesRoutingModule } from './view-sent-files-routing.module'
import { ViewSentFilesComponent } from './view-sent-files.component'
import { ViewSentFilesService } from './view-sent-files.service'

@NgModule({
  imports: [AppSharedModule, ViewSentFilesRoutingModule],
  declarations: [ViewSentFilesComponent],
  providers: [ViewSentFilesService],
})
export class ViewSentFilesModule {}
