import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CardinquiresComponent } from './cardinquires.component'

const routes: Routes = [
  {
    path: '',
    component: CardinquiresComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardinquiresRoutingModule {}
