import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommercialCardsManagementOptionsComponent } from './commercial-cards-management-options.component'
import { AuthGuardViewQueryCards } from './ViewQueryCards/auth-guard.service'

export const routes: Routes = [
  {
    path: '',
    component: CommercialCardsManagementOptionsComponent,
  },
  {
    path: 'menu',
    component: CommercialCardsManagementOptionsComponent,
  },
  {
    path: 'viewquerycards',
    canLoad: [AuthGuardViewQueryCards],
    loadChildren: () =>
      import('./ViewQueryCards/module-module').then(
        (m) => m.ViewQueryCardsModule,
      ),
  },
  {
    path: 'creditcardlist',
    canLoad: [AuthGuardViewQueryCards],
    loadChildren: () =>
      import('./ViewQueryCards/module-module').then(
        (m) => m.ViewQueryCardsModule,
      ),
  },
  {
    path: 'requeststatus',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercialCardsManagementRoutingModule {}
