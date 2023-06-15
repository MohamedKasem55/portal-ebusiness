import { NgModule } from '@angular/core'
import { ChartsModule } from 'ng2-charts'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { MonthlyStatisticsRoutingModule } from './monthly-statistics-routing.module'
import { MonthlyStatisticsComponent } from './monthly-statistics.component'
import { MonthlyStatisticsService } from './monthly-statistics.service'
import { BarChartComponent } from './MonthlyStatistics/bar-chart/bar-chart.component'
import { DonatComponent } from './MonthlyStatistics/donat/donat.component'
import { GraphicsComponent } from './MonthlyStatistics/Graphics/graphics.component'
import { GraphicsService } from './MonthlyStatistics/Graphics/graphics.service'

@NgModule({
  imports: [
    AppSharedModule,
    MonthlyStatisticsRoutingModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    MonthlyStatisticsComponent,
    GraphicsComponent,
    DonatComponent,
    BarChartComponent,
  ],
  providers: [MonthlyStatisticsService, GraphicsService],
})
export class MonthlyStatisticsModule {}
