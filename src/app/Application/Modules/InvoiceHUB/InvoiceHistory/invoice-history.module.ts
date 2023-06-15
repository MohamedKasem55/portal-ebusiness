import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { InvoiceHistoryRoutingModule } from './invoice-history-routing.module'
import { InvoiceHistoryComponent } from './invoice-history.component'
import { InvoiceHistoryService } from './invoice-history.service'

@NgModule({
  imports: [
    AppSharedModule,
    InvoiceHistoryRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [InvoiceHistoryComponent],
  providers: [InvoiceHistoryService],
})
export class InvoiceHistoryModule {}
