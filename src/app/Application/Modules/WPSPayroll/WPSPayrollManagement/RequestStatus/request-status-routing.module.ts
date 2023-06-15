import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestReactivateComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateFileComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/RequestStatus/reactivateFile/request-reactivate-file.component'
import { RequestStatusComponent } from '../../../../Modules/WPSPayroll/WPSPayrollManagement/RequestStatus/request-status.component'

const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
  },
  { path: 'activate', component: RequestReactivateComponent },
  { path: 'activate-file', component: RequestReactivateFileComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestStatusRoutingModule {}
