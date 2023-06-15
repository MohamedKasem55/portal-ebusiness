import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MonthlyStatementsComponent } from './accounts-monthly-statements.component'

const routes: Routes = [
  {
    path: '',
    component: MonthlyStatementsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyStatementsRoutingModule {}
