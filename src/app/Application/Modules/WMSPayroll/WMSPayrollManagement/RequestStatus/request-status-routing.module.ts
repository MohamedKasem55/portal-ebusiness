import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RequestStatusComponent } from './request-status.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateFileComponent } from './reactivateFile/request-reactivate-file.component'

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
