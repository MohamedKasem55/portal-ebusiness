import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { VatInvoiceRoutingModule } from './vat-invoice-routing.module'
import { VatInvoiceComponent } from './vat-invoice.component'
import { VatInvoiceService } from './vat-invoice.service'

@NgModule({
  imports: [AppSharedModule, FormsModule, VatInvoiceRoutingModule],
  declarations: [VatInvoiceComponent],
  providers: [VatInvoiceService],
})
export class VatInvoiceModule {}
