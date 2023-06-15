import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RepresentedComponent } from './represented.component'
import { RepresentedGuard } from './represented.guard'
import { RepresentedDetailsComponent } from './Detailes/represented-details.component'

export const routes: Routes = [
  {
    path: '',
    canLoad: [RepresentedGuard],
    component: RepresentedComponent,
  },
  {
    path: 'details',
    canLoad: [RepresentedGuard],
    component: RepresentedDetailsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepresentedRoutingModule {
}
