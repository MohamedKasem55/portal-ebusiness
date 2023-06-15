import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MonthlyStatisticsComponent } from './monthly-statistics.component'

const routes: Routes = [
  {
    path: '',
    component: MonthlyStatisticsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyStatisticsRoutingModule {}
