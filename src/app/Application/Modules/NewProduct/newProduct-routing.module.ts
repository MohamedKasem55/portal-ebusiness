import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WpsPayrollNewComponent } from './WpsPayrollNew/wps-payroll-new.component';
import { WpsRequestDetailsComponent } from './WpsRequestDetails/wps-request-details.component';
import { WpsRequestStatusComponent } from './WpsRequestStatus/wps-request-status.component';

const routes: Routes = [

  {
    path: 'wps/new',
    component: WpsPayrollNewComponent,
  },
  {
    path: 'wps/update',
    component: WpsPayrollNewComponent,
  },
  {
    path: 'wps/requestStatus',
    component: WpsRequestStatusComponent,
  },
  {
    path: 'wps/requestDetails',
    component: WpsRequestDetailsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class NewProductRoutingModule { }
