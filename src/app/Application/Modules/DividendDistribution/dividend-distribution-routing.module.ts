import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DividendDistributionInquiryListComponent } from './Inquiry/components/list/dividend-distribution-inquiry-list.component'
import { DividendDistributionInquiryListGuard } from './Inquiry/components/list/dividend-distribution-inquiry-list.guard'
import { DividendDistributionReportsListGuard } from './Reports/components/list/dividend-distribution-reports-list.guard'
import { DividendDistributionReportsListComponent } from './Reports/components/list/dividend-distribution-reports-list.component'
import { DividedDistributionRequestReportComponent } from './divided-distribution-request-report/divided-distribution-request-report.component'
import { DividedDistributionsRequestReportGuard } from './request-reports/divided-distributions-request-report.guard'

export const routes: Routes = [
  {
    path: 'inquiry',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        canLoad: [DividendDistributionInquiryListGuard],
        component: DividendDistributionInquiryListComponent,
      },
    ],
  },
  {
    path: 'reports',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        canLoad: [DividendDistributionReportsListGuard],
        component: DividendDistributionReportsListComponent,
      },
    ],
  },
  {
    path: 'request-reports',
    component: DividedDistributionRequestReportComponent,
    canActivate: [DividedDistributionsRequestReportGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DividendDistributionRoutingModule {}
