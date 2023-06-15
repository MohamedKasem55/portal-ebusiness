import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomizeReportComponent } from './customizeReport.component'
import { CustomizeReportGuard } from './customizeReport.guard'

const routes: Routes = [
  {
    path: '',
    component: CustomizeReportComponent,
    canLoad: [CustomizeReportGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizeReportRoutingModule {
}
