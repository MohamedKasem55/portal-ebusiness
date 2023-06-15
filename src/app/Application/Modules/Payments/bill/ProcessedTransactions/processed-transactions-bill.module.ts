import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { ProcessedTransactionsDetailComponent } from './details/processed-transactions-detail.component'
import { ProcessedTransactionsDetailService } from './details/processed-transactions-detail.service'
import { ProcessedTransactionsComponent } from './list/processed-transactions.component'
import { ProcessedTransactionsListService } from './list/processed-transactions-list.service'
import { ProcessedTransactionsBillRoutingModule } from './processed-transactions-bill-routing.module'
import { ProcessedTransactionsBillService } from './processed-transactions-bill.service'

@NgModule({
  imports: [
    AppSharedModule,
    ProcessedTransactionsBillRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ProcessedTransactionsDetailComponent, ProcessedTransactionsComponent],
  providers: [ProcessedTransactionsBillService, ProcessedTransactionsDetailService, ProcessedTransactionsListService]
})
export class ProcessedTransactionsBillModule { }
