import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../../core/shared/shared.module'
import { DeleteFilesUploadedComponent } from './components/DeleteFiles1/delete-files-uploaded1.component'
import { DeleteFilesUploaded2Component } from './components/DeleteFiles2/delete-files-uploaded2.component'
import { DeleteFilesUploaded3Component } from './components/DeleteFiles3/delete-files-uploaded3.component'
import { DetailsUploadedFilesComponent } from './components/DetailsUploadedFiles/details-uploaded-files.component'
import { ViewUploadedFilesRoutingModule } from './view-uploaded-files-routing.module'
import { ViewUploadedFilesComponent } from './view-uploaded-files.component'

@NgModule({
  imports: [AppSharedModule, ViewUploadedFilesRoutingModule],
  declarations: [
    ViewUploadedFilesComponent,
    DeleteFilesUploadedComponent,
    DeleteFilesUploaded2Component,
    DeleteFilesUploaded3Component,
    DetailsUploadedFilesComponent,
  ],
})
export class ViewUploadedFilesModule {}
