import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
// Service to GET FeedBackFiles
import { FeedBackFiles } from '../Services/feedback-files-list.service'
import { MOIFeedBackFilesDetailComponent } from './feedback-files-details.component'
import { FeedBackFilesRoutingModule } from './feedback-files-routing.module'
import { FeedBackFilesComponent } from './feedback-files.component'

@NgModule({
  imports: [AppSharedModule, FeedBackFilesRoutingModule],
  declarations: [FeedBackFilesComponent, MOIFeedBackFilesDetailComponent],
  providers: [FeedBackFiles],
})
export class FeedBackFilesModule {}
