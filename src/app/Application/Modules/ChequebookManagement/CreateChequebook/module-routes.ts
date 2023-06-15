import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CreateChequebookComponent } from './create-chequebook.component'

export const routes: Routes = [
  {
    path: '',
    component: CreateChequebookComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
