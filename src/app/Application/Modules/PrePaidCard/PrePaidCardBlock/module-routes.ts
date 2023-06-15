import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrePaidCardBlockComponent } from './prePaidCardBlock.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardBlockComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
