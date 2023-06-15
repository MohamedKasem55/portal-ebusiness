import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MRCCComponent } from './mrcc.component'

const routes: Routes = [
  {
    path: 'newRequest',
    component: MRCCComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MRCCRoutingModule { }
