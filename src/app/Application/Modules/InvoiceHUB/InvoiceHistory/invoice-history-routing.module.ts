import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { InvoiceHistoryComponent } from './invoice-history.component'

const routes: Routes = [
  {
    path: '',
    component: InvoiceHistoryComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceHistoryRoutingModule {}
