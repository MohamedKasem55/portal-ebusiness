import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BopComponent } from './Components/bop/bop.component'
import { RefundSadadOLPComponent } from './Components/refunds/refund-sadad-olp.component'
import { RefundSadadOLPGuard } from './Components/refunds/refund-sadad-olp.guard'
import { OLPNotificationsListComponent } from './Components/notifications/list/olp-notifications-list.component'
import { CloseOLPNotificationsComponent } from './Components/notifications/close/close-notifications.component'
import { CloseOLPNotificationsGuard } from './Components/notifications/close/close-notifications.guard'
import { InitiateSadadTestingGuard } from './Components/testing/initiate/initiate-sadad-testing.guard'
import { InitiateSadadTestingComponent } from './Components/testing/initiate/initiate-sadad-testing.component'
import { ViewSadadTestingGuard } from './Components/testing/view/view-sadad-testing.guard'
import { ViewSadadTestingComponent } from './Components/testing/view/view-sadad-testing.component'
import { ViewSadadTestingListComponent } from './Components/testing/view/list/view-sadad-testing-list.component'
import { OLPTransactionsListComponent } from './Components/transactions/list/olp-transactions-list.component'
import { SadadOlpCaEnrollmentComponent } from './Components/ca-enrollment/sadad-olp-ca-enrollment.component'
import { SadadOlpCaEnrollmentGuard } from './Components/ca-enrollment/sadad-olp-ca-enrollment.guard'
import { DisputeSadadOLPGuard } from './Components/disputes/dispute-sadad-olp.guard'
import { OLPDisputesListComponent } from './Components/disputes/list/olp-disputes-list.component'
import { DisputesDetailComponent } from './Components/disputes/dispute-detail/view-disputes-detail.component'
import { RequestStatusSadadOLPGuard } from './Components/request-status/request-status-sadad-olp.guard'
import { OLPRequestStatusListComponent } from './Components/request-status/list/request-status-list.component'
import { RequestStatusActionGuard } from './Components/request-status/action/request-status-action.guard'
import { RequestStatusActionComponent } from './Components/request-status/action/request-status-action.component'

const routes: Routes = [
  {
    path: 'ManagementToolsDocumentation',
    component: BopComponent,
  },
  {
    path: 'olp-refunds',
    canLoad: [RefundSadadOLPGuard],
    component: RefundSadadOLPComponent,
  },
  {
    path: 'olp-notifications',
    component: OLPNotificationsListComponent,
  },
  {
    path: 'olp-close-notifications',
    canLoad: [CloseOLPNotificationsGuard],
    component: CloseOLPNotificationsComponent,
  },
  {
    path: 'olp-initiate-testing',
    canLoad: [InitiateSadadTestingGuard],
    component: InitiateSadadTestingComponent,
  },
  {
    path: 'olp-view-testing',
    canLoad: [ViewSadadTestingGuard],
    component: ViewSadadTestingComponent,
  },
  {
    path: 'olp-listview-testing',
    canLoad: [ViewSadadTestingGuard],
    component: ViewSadadTestingListComponent,
  },
  {
    path: 'olp-transactions',
    component: OLPTransactionsListComponent,
  },
  {
    path: 'ca-enrollment',
    canLoad: [SadadOlpCaEnrollmentGuard],
    component: SadadOlpCaEnrollmentComponent,
  },
  {
    path: 'olp-disputes',
    canLoad: [DisputeSadadOLPGuard],
    component: OLPDisputesListComponent,
  },
  {
    path: 'olp-disputes-detail',
    canLoad: [DisputeSadadOLPGuard],
    component: DisputesDetailComponent,
  },
  {
    path: 'olp-request-status',
    canLoad: [RequestStatusSadadOLPGuard],
    component: OLPRequestStatusListComponent,
  },
  {
    path: 'olp-request-action',
    canLoad: [RequestStatusActionGuard],
    component: RequestStatusActionComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SadadOLPRoutingModule {}
