import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CardAllocationRequestComponent } from './card-allocation-request.component'

const routes: Routes = [
  {
    path: '',
    component: CardAllocationRequestComponent,
  },
  //{ path: 'reinitialize', component: ReinitiateComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllocationreqRoutingModule {}
