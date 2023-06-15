import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdmAccountsRoutingModule } from './cdm-accounts.routing.module'
import { LockboxAccountsListComponent } from './components/list/lockbox-accounts-list.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { LockboxAccountsListService } from './components/list/lockbox-accounts-list.service'
import { LockboxAccountsListGuard } from './components/list/lockbox-accounts-list.guard'
import { LockboxAccountsEditComponent } from './components/edit/lockbox-accounts-edit.component'
import { LockboxAccountsDetailsService } from './components/details/lockbox-accounts-details.service'
import { LockboxAccountsDetailsGuard } from './components/details/lockbox-accounts-details.guard'
import { LockboxAccountsEditService } from './components/edit/lockbox-accounts-edit.service'
import { LockboxAccountsEditGuard } from './components/edit/lockbox-accounts-edit.guard'
import { LockboxAccountsDetailsComponent } from './components/details/lockbox-accounts-details.component'

@NgModule({
  imports: [AppSharedModule, CommonModule, CdmAccountsRoutingModule],
  declarations: [
    LockboxAccountsListComponent,
    LockboxAccountsDetailsComponent,
    LockboxAccountsEditComponent,
  ],
  providers: [
    LockboxAccountsListService,
    LockboxAccountsListGuard,
    LockboxAccountsDetailsService,
    LockboxAccountsDetailsGuard,
    LockboxAccountsEditService,
    LockboxAccountsEditGuard,
  ],
})
export class CdmAccountsModule {}
