import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ViewProcessedFilesComponent } from './view-processed-files.component'

const routes: Routes = [
  {
    path: '',
    component: ViewProcessedFilesComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewProcessedFilesRoutingModule {}
