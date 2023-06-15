import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProcessedTransactionsDetailComponent } from './details/processed-transactions-detail.component'
import { ProcessedTransactionsComponent } from './list/processed-transactions.component'


const routes: Routes = [

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ProcessedTransactionsComponent
  },
  {
    path: 'details',
    component: ProcessedTransactionsDetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessedTransactionsBillRoutingModule { }
