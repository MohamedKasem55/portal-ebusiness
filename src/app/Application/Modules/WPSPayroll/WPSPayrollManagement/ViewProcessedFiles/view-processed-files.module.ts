import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ViewProcessedFilesRoutingModule } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ViewProcessedFiles/view-processed-files-routing.module'
import { ViewProcessedFilesComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/ViewProcessedFiles/view-processed-files.component'
// General service to optain static data
import { ViewProcessedFilesService } from './view-processed-files-service'

@NgModule({
  imports: [
    AppSharedModule,
    ViewProcessedFilesRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
  ],
  declarations: [ViewProcessedFilesComponent],
  providers: [ViewProcessedFilesService],
})
export class ViewProcessedFilesModule {}
