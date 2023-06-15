import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestStatusComponent } from './request-status.component'

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
