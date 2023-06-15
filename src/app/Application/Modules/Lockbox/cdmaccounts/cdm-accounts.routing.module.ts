import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LockboxAccountsListComponent } from './components/list/lockbox-accounts-list.component'
import { LockboxAccountsListGuard } from './components/list/lockbox-accounts-list.guard'
import { LockboxAccountsDetailsGuard } from './components/details/lockbox-accounts-details.guard'
import { LockboxAccountsDetailsComponent } from './components/details/lockbox-accounts-details.component'
import { LockboxAccountsEditGuard } from './components/edit/lockbox-accounts-edit.guard'
import { LockboxAccountsEditComponent } from './components/edit/lockbox-accounts-edit.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [LockboxAccountsListGuard],
    component: LockboxAccountsListComponent,
  },
  {
    path: 'details',
    canLoad: [LockboxAccountsDetailsGuard],
    component: LockboxAccountsDetailsComponent,
  },
  {
    path: 'edit',
    canLoad: [LockboxAccountsEditGuard],
    component: LockboxAccountsEditComponent,
  },
  // {
  //     path: 'terminaldetails',
  //     component: TerminaldetailsComponent
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CdmAccountsRoutingModule {}
