import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LockboxUsersListComponent } from './components/list/lockbox-users-list.component'
import { LockboxUsersListGuard } from './components/list/lockbox-users-list.guard'
import { LockboxUsersDetailsGuard } from './components/details/lockbox-users-details.guard'
import { LockboxUsersDetailsComponent } from './components/details/lockbox-users-details.component'
import { LockboxUsersEditGuard } from './components/edit/lockbox-users-edit.guard'
import { LockboxUsersEditComponent } from './components/edit/lockbox-users-edit.component'
import { LockboxUsersAddGuard } from './components/add/lockbox-users-add.guard'
import { LockboxUsersAddComponent } from './components/add/lockbox-users-add.component'
import { LockboxUsersDeleteGuard } from './components/delete/lockbox-users-delete.guard'
import { LockboxUsersDeleteComponent } from './components/delete/lockbox-users-delete.component'
import { LockboxUsersAddInitComponent } from './components/add/lockbox-users-add-init.component'
import { LockboxUsersBulkShiftingComponent } from './components/bulk-shifting/lockbox-users-bulk-shifting.component'
import { LockboxUserTransactionsListGuard } from './components/user-transactions/lockbox-user-transactions-list.guard'
import { LockboxUserTransactionsListComponent } from './components/user-transactions/lockbox-user-transactions-list.component'
import { LockboxUsersBulkShiftingGuard } from './components/bulk-shifting/lockbox-users-bulk-shifting.guard'
import { LockboxUsersChangeStatusGuard } from './components/change-status/lockbox-users-change-status.guard'
import { LockboxUsersChangeStatusComponent } from './components/change-status/lockbox-users-change-status.component'
import { LockboxUsersAccountsGuard } from './components/accounts/lockbox-users-accounts.guard'
import { LockboxUsersAccountsComponent } from './components/accounts/lockbox-users-accounts.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [LockboxUsersListGuard],
    component: LockboxUsersListComponent,
  },
  {
    path: 'details',
    canLoad: [LockboxUsersDetailsGuard],
    component: LockboxUsersDetailsComponent,
  },
  {
    path: 'add-init',
    canLoad: [LockboxUsersAddGuard],
    component: LockboxUsersAddInitComponent,
  },
  {
    path: 'add',
    canLoad: [LockboxUsersAddGuard],
    component: LockboxUsersAddComponent,
  },
  {
    path: 'edit',
    canLoad: [LockboxUsersEditGuard],
    component: LockboxUsersEditComponent,
  },
  {
    path: 'delete',
    canLoad: [LockboxUsersDeleteGuard],
    component: LockboxUsersDeleteComponent,
  },
  {
    path: 'change-status',
    canLoad: [LockboxUsersChangeStatusGuard],
    component: LockboxUsersChangeStatusComponent,
  },
  {
    path: 'bulk-shifting',
    canLoad: [LockboxUsersBulkShiftingGuard],
    component: LockboxUsersBulkShiftingComponent,
  },
  {
    path: 'user-transactions',
    canLoad: [LockboxUserTransactionsListGuard],
    component: LockboxUserTransactionsListComponent,
  },
  {
    path: 'accounts',
    canLoad: [LockboxUsersAccountsGuard],
    component: LockboxUsersAccountsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CdmUsersRoutingModule {}
