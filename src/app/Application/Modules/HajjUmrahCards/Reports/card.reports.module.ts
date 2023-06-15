import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CardReportsComponent } from './card.reports.component'
import { routes } from './card.reports.routing.module'
import { CardReportsService } from './card.reports.service'

@NgModule({
  declarations: [CardReportsComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [CardReportsService],
})
export class CardReportsModule {}
