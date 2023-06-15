import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { MonthlyStatementsComponent } from './accounts-monthly-statements.component'
import { MonthlyStatementsRoutingModule } from './accounts-monthly-statements.routing.module'
import { MonthlyStatementsService } from './accounts-monthly-statements.service'

@NgModule({
  imports: [AppSharedModule, FormsModule, MonthlyStatementsRoutingModule],
  declarations: [MonthlyStatementsComponent],
  providers: [MonthlyStatementsService],
})
export class MonthlyStatementsModule {}
