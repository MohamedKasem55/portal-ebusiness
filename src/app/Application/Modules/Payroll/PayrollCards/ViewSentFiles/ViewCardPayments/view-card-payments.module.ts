import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../../core/shared/shared.module'
import { DeleteFilesCard1Component } from './components/DeleteFiles1/delete-files-card1.component'
import { DeleteFilesCard2Component } from './components/DeleteFiles2/delete-files-card2.component'
import { DeleteFilesCard3Component } from './components/DeleteFiles3/delete-files-card3.component'
import { DetailsUploadedFilesComponent } from './components/DetailsUploadedFiles/details-uploaded-files.component'
import { ViewCardPaymentsRoutingModule } from './view-card-payments-routing.module'
import { ViewCardPaymentsComponent } from './view-card-payments.component'

@NgModule({
  imports: [AppSharedModule, ViewCardPaymentsRoutingModule],
  declarations: [
    ViewCardPaymentsComponent,
    DeleteFilesCard1Component,
    DeleteFilesCard2Component,
    DeleteFilesCard3Component,
    DetailsUploadedFilesComponent,
  ],
})
export class ViewCardPaymentsModule {}
