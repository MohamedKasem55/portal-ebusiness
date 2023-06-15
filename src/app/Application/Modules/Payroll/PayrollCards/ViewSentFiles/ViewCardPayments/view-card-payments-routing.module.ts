import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeleteFilesCard1Component } from './components/DeleteFiles1/delete-files-card1.component'
import { DeleteFilesCard2Component } from './components/DeleteFiles2/delete-files-card2.component'
import { DeleteFilesCard3Component } from './components/DeleteFiles3/delete-files-card3.component'
import { DetailsUploadedFilesComponent } from './components/DetailsUploadedFiles/details-uploaded-files.component'
import { ViewCardPaymentsComponent } from './view-card-payments.component'

const routes: Routes = [
  {
    path: '',
    component: ViewCardPaymentsComponent,
    children: [
      {
        path: '',
        redirectTo: 'delete-files-card1',
        pathMatch: 'full',
      },
      {
        path: 'delete-files-card1',
        component: DeleteFilesCard1Component,
      },
      {
        path: 'delete-files-card2',
        component: DeleteFilesCard2Component,
      },
      {
        path: 'delete-files-card3',
        component: DeleteFilesCard3Component,
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
export class ViewCardPaymentsRoutingModule {}
