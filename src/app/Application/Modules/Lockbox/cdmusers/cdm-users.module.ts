import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdmUsersRoutingModule } from './cdm-users.routing.module'
import { LockboxUsersListComponent } from './components/list/lockbox-users-list.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { LockboxUsersListService } from './components/list/lockbox-users-list.service'
import { LockboxUsersListGuard } from './components/list/lockbox-users-list.guard'
import { LockboxUsersEditComponent } from './components/edit/lockbox-users-edit.component'
import { LockboxUsersDetailsService } from './components/details/lockbox-users-details.service'
import { LockboxUsersDetailsGuard } from './components/details/lockbox-users-details.guard'
import { LockboxUsersEditService } from './components/edit/lockbox-users-edit.service'
import { LockboxUsersEditGuard } from './components/edit/lockbox-users-edit.guard'
import { LockboxUsersDetailsComponent } from './components/details/lockbox-users-details.component'
import { LockboxUsersAddComponent } from './components/add/lockbox-users-add.component'
import { LockboxUsersAddService } from './components/add/lockbox-users-add.service'
import { LockboxUsersAddGuard } from './components/add/lockbox-users-add.guard'
import { LockboxUsersDeleteService } from './components/delete/lockbox-users-delete.service'
import { LockboxUsersDeleteGuard } from './components/delete/lockbox-users-delete.guard'
import { LockboxUsersDeleteComponent } from './components/delete/lockbox-users-delete.component'
import { LockboxUsersAddInitComponent } from './components/add/lockbox-users-add-init.component'
import { LockboxUserTransactionsListComponent } from './components/user-transactions/lockbox-user-transactions-list.component'
import { LockboxUsersBulkShiftingGuard } from './components/bulk-shifting/lockbox-users-bulk-shifting.guard'
import { LockboxUserTransactionsListGuard } from './components/user-transactions/lockbox-user-transactions-list.guard'
import { LockboxUsersBulkShiftingComponent } from './components/bulk-shifting/lockbox-users-bulk-shifting.component'
import { LockboxUsersBulkShiftingService } from './components/bulk-shifting/lockbox-users-bulk-shifting.service'
import { LockboxUsersChangeStatusComponent } from './components/change-status/lockbox-users-change-status.component'
import { LockboxUsersChangeStatusService } from './components/change-status/lockbox-users-change-status.service'
import { LockboxUsersChangeStatusGuard } from './components/change-status/lockbox-users-change-status.guard'
import { LockboxUserTransactionsListService } from './components/user-transactions/lockbox-user-transactions-list.service'
import { LockboxUsersAccountsService } from './components/accounts/lockbox-users-accounts.service'
import { LockboxUsersAccountsGuard } from './components/accounts/lockbox-users-accounts.guard'
import { LockboxUsersAccountsComponent } from './components/accounts/lockbox-users-accounts.component'

@NgModule({
  imports: [AppSharedModule, CommonModule, CdmUsersRoutingModule],
  declarations: [
    LockboxUsersListComponent,
    LockboxUsersDetailsComponent,
    LockboxUsersAddComponent,
    LockboxUsersAddInitComponent,
    LockboxUsersEditComponent,
    LockboxUsersDeleteComponent,
    LockboxUsersChangeStatusComponent,
    LockboxUsersBulkShiftingComponent,
    LockboxUserTransactionsListComponent,
    LockboxUsersAccountsComponent,
  ],
  providers: [
    LockboxUsersListService,
    LockboxUsersListGuard,
    LockboxUsersDetailsService,
    LockboxUsersDetailsGuard,
    LockboxUsersAddService,
    LockboxUsersAddGuard,
    LockboxUsersEditService,
    LockboxUsersEditGuard,
    LockboxUsersDeleteService,
    LockboxUsersDeleteGuard,
    LockboxUsersChangeStatusService,
    LockboxUsersChangeStatusGuard,
    LockboxUsersBulkShiftingService,
    LockboxUsersBulkShiftingGuard,
    LockboxUserTransactionsListService,
    LockboxUserTransactionsListGuard,
    LockboxUsersAccountsService,
    LockboxUsersAccountsGuard,
  ],
})
export class CdmUsersModule {}
