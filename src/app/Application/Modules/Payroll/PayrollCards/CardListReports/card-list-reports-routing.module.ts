import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CardListReportsComponent } from '../../../../Modules/Payroll/PayrollCards/CardListReports/card-list-reports.component'

const routes: Routes = [
  {
    path: '',
    component: CardListReportsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardListReportsRoutingModule {}
