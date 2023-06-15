import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { LockboxTerminalsListGuard } from './list/lockbox-terminals-list.guard'
import { LockboxTerminalsListComponent } from './list/lockbox-terminals-list.component'
import { LockboxTerminalsDetailsGuard } from './details/lockbox-terminals-details.guard'
import { LockboxTerminalsDetailsComponent } from './details/lockbox-terminals-details.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [LockboxTerminalsListGuard],
    component: LockboxTerminalsListComponent,
  },
  {
    path: 'details',
    canLoad: [LockboxTerminalsDetailsGuard],
    component: LockboxTerminalsDetailsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CdmTerminalsRoutingModule {}
