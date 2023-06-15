import { LockboxReportsListGuard } from './list/lockbox-reports-list.guard'
import { LockboxCashOutListComponent } from './cashOut/lockbox-cashOut-list.component'
import { Routes } from '@angular/router'
import { LockboxTransactionsListGuard } from './transactions/lockbox-transactions-list.guard'
import { LockboxCashOutListGuard } from './cashOut/lockbox-cashOut-list.guard'
import { LockboxReportsListComponent } from './list/lockbox-reports-list.component'
import { LockboxTransactionsListComponent } from './transactions/lockbox-transactions-list.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [LockboxReportsListGuard],
    component: LockboxReportsListComponent,
  },
  {
    path: 'transactions',
    canLoad: [LockboxTransactionsListGuard],
    component: LockboxTransactionsListComponent,
  },
  {
    path: 'cashOut',
    canLoad: [LockboxCashOutListGuard],
    component: LockboxCashOutListComponent,
  },
]
