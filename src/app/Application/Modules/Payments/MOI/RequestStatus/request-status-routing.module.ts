import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestStatusGuard } from '../Guard/request-status.guard'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestStatusComponent } from './request-status.component'

const routes: Routes = [
  {
    path: '',
    canActivate: [RequestStatusGuard],
    component: RequestStatusComponent,
  },
  {
    path: 'activate',
    canLoad: [RequestStatusGuard],
    component: RequestReactivateComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestStatusRoutingModule {}
