import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LokbxstatementComponent } from './lokbxstatement/lokbxstatement.component'

const routes: Routes = [
  {
    path: '',
    component: LokbxstatementComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LockboxstatementRoutingModule {}
