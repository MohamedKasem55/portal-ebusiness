import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { CardListReportsRoutingModule } from '../../../../Modules/Payroll/PayrollCards/CardListReports/card-list-reports-routing.module'
import { CardListReportsComponent } from '../../../../Modules/Payroll/PayrollCards/CardListReports/card-list-reports.component'
import { CardListReportsService } from './card-list-reports.service'

@NgModule({
  imports: [AppSharedModule, CardListReportsRoutingModule],
  declarations: [CardListReportsComponent],
  providers: [CardListReportsService],
})
export class CardListReportsModule {}
