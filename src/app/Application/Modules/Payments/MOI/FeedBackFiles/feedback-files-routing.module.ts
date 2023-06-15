import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MOIFeedBackFilesDetailComponent } from './feedback-files-details.component'
import { FeedBackFilesComponent } from './feedback-files.component'

const routes: Routes = [
  {
    path: '',
    component: FeedBackFilesComponent,
  },
  {
    path: 'details',
    component: MOIFeedBackFilesDetailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedBackFilesRoutingModule {}
