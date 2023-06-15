import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ProcessedTransactionsDetailComponent } from './details/processed-transactions-detail.component'
import { ProcessedTransactionsDetailService } from './details/processed-transactions-detail.service'
import { ProcessedTransactionsComponent } from './list/processed-transactions.component'
import { ProcessedTransactionsListService } from './list/processed-transactions-list.service'
import { ProcessedTransactionsInvoiceRoutingModule } from './processed-transactions-Invoice-routing.module'
import { ProcessedTransactionsInvoiceService } from './processed-transactions-invoice.service'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'

@NgModule({
  imports: [
    AppSharedModule,
    ProcessedTransactionsInvoiceRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ProcessedTransactionsDetailComponent, ProcessedTransactionsComponent],
  providers: [ProcessedTransactionsListService, ProcessedTransactionsDetailService, ProcessedTransactionsInvoiceService, ModelPipe],
})
export class ProcessedTransactionsInvoiceModule { }
