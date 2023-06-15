import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ViewRequestComponent } from './view-request.component'

export const routes: Routes = [
  {
    path: '',
    component: ViewRequestComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
