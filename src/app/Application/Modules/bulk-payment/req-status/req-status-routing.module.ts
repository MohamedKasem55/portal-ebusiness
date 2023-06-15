import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ReinitiateComponent } from './reinitiate/reinitiate.component'
import { ReqStatusComponent } from './req-status/req-status.component'

const routes: Routes = [
  {
    path: '',
    component: ReqStatusComponent,
  },
  { path: 'reinitialize', component: ReinitiateComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReqStatusRoutingModule {}
