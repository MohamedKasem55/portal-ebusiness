import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrePaidCardActivateComponent } from './prePaidCardActivate.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardActivateComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
