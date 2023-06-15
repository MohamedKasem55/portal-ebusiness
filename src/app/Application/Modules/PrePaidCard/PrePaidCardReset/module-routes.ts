import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrePaidCardResetPinComponent } from './prePaidCardResetPin.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardResetPinComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
