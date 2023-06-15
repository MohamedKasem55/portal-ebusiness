import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuardProcessedTransactionsDetail } from './details/auth-guard-processed-transactions-detail.service'
import { ProcessedTransactionsDetailComponent } from './details/processed-transactions-detail.component'
import { AuthGuardProcessedTransactionsList } from './list/auth-guard-processed-transactions-list.service'
import { ProcessedTransactionsComponent } from './list/processed-transactions.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [AuthGuardProcessedTransactionsList],
    component: ProcessedTransactionsComponent
  },
  {
    path: 'details',
    canLoad: [AuthGuardProcessedTransactionsDetail],
    component: ProcessedTransactionsDetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessedTransactionsInvoiceRoutingModule { }
