import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import {
  DividendDistributionRoutingModule,
  routes,
} from './dividend-distribution-routing.module'
import { DividendDistributionInquiryListComponent } from './Inquiry/components/list/dividend-distribution-inquiry-list.component'
import { DividendDistributionInquiryListService } from './Inquiry/components/list/dividend-distribution-inquiry-list.service'
import { DividendDistributionReportsListComponent } from './Reports/components/list/dividend-distribution-reports-list.component'
import { DividendDistributionReportsListService } from './Reports/components/list/dividend-distribution-reports-list.service'
import { DividedDistributionsRequestReportGuard } from './request-reports/divided-distributions-request-report.guard'
import { DividedDistributionRequestReportComponent } from './divided-distribution-request-report/divided-distribution-request-report.component'

@NgModule({
  declarations: [
    DividendDistributionInquiryListComponent,
    DividendDistributionReportsListComponent,
    DividedDistributionRequestReportComponent,
  ],
  imports: [
    CommonModule,
    DividendDistributionRoutingModule,
    AppSharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    DividendDistributionInquiryListService,
    DividendDistributionReportsListService,
    DividedDistributionsRequestReportGuard,
  ],
})
export class DividendDistributionModule {}
