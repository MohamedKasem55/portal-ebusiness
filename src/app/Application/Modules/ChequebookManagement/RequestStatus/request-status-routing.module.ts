import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateStopComponent } from './reactivateStopCheque/request-reactivate-stop.component'
import { RequestStatusComponent } from './request-status.component'

const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
  },
  { path: 'activate', component: RequestReactivateComponent },
  { path: 'activateStop', component: RequestReactivateStopComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestStatusRoutingModule {}
