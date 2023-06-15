import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestReactivateComponent } from '../../../Modules/InvoiceHUB/RequestStatus/reactivate/request-reactivate.component'
import { RequestStatusComponent } from '../../../Modules/InvoiceHUB/RequestStatus/request-status.component'

const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
  },
  { path: 'activate', component: RequestReactivateComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestStatusRoutingModule {}
