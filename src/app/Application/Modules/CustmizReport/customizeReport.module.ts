import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { CustomizeReportRoutingModule } from './customizeReport-routing.module'
import { CustomizeReportService } from './customizeReport.service'
import { CustomizeReportComponent } from './customizeReport.component'
import { CommonModule } from '@angular/common'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'


@NgModule({
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    AppSharedModule,
    CustomizeReportRoutingModule,
  ],
  declarations: [
    CustomizeReportComponent
  ],
  providers: [CustomizeReportService],
})
export class CustomizeReportModule { }


