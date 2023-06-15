import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeleteFilesUploadedComponent } from './components/DeleteFiles1/delete-files-uploaded1.component'
import { DeleteFilesUploaded2Component } from './components/DeleteFiles2/delete-files-uploaded2.component'
import { DeleteFilesUploaded3Component } from './components/DeleteFiles3/delete-files-uploaded3.component'
import { DetailsUploadedFilesComponent } from './components/DetailsUploadedFiles/details-uploaded-files.component'
import { ViewUploadedFilesComponent } from './view-uploaded-files.component'

const routes: Routes = [
  {
    path: '',
    component: ViewUploadedFilesComponent,
    children: [
      {
        path: '',
        redirectTo: 'delete-files-uploaded1',
        pathMatch: 'full',
      },
      {
        path: 'delete-files-uploaded1',
        component: DeleteFilesUploadedComponent,
      },
      {
        path: 'delete-files-uploaded2',
        component: DeleteFilesUploaded2Component,
      },
      {
        path: 'delete-files-uploaded3',
        component: DeleteFilesUploaded3Component,
      },
      {
        path: 'details-uploaded-files',
        component: DetailsUploadedFilesComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewUploadedFilesRoutingModule {}
