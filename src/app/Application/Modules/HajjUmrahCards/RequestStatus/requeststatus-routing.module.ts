import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { RequestStatusComponent } from './request-status.component'
import { CardOperationsReactivateComponent } from './components/operations/reactivate/card-operations-reactivate.component'
import { CardAllocationReactivateComponent } from './components/allocation/reactivate/card-allocation-reactivate.component'

const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
  },
  {
    path: 'card-operation/activate',
    component: CardOperationsReactivateComponent,
  },
  {
    path: 'card-allocation/activate',
    component: CardAllocationReactivateComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequeststatusRoutingModule {}
