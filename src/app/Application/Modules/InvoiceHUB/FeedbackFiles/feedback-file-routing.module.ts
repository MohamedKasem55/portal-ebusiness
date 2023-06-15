import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FeedbackFileComponent } from './feedback-file.component'

const routes: Routes = [
  {
    path: '',
    component: FeedbackFileComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackFileRoutingModule {}
