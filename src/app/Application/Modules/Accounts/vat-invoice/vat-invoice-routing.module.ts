import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { VatInvoiceComponent } from './vat-invoice.component'

const routes: Routes = [
  {
    path: '',
    component: VatInvoiceComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VatInvoiceRoutingModule {}
