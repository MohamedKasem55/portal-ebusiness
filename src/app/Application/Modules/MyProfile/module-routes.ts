import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MyProfileActivityLogsList } from './Component/my-profile-activity-logs-list.component'
import { MyProfileAlertCreate } from './Component/my-profile-alert-create.component'
import { MyProfileAlertDelete } from './Component/my-profile-alert-delete.component'
import { MyProfileAlertEdit } from './Component/my-profile-alert-edit.component'
import { MyProfileAlert } from './Component/my-profile-alert.component'
import { MyProfileOperationDetail } from './Component/my-profile-operation-detail.component'
import { MyProfileActivityLogsGuard } from './Guard/my-profile-activity-logs.guard'
import { MyProfileAlertGuard } from './Guard/my-profile-alert.guard'
import { MailsGuard } from './Mails/mails.guard'
import { PendingActionsGuard } from './PendingActions/pending-actions.guard'

export const routes: Routes = [
  {
    path: 'activityLogs',
    canLoad: [MyProfileActivityLogsGuard],
    component: MyProfileActivityLogsList,
  },
  {
    path: 'activityLogs/detail',
    canLoad: [MyProfileActivityLogsGuard],
    component: MyProfileOperationDetail,
  },
  {
    path: 'alerts',
    canLoad: [MyProfileAlertGuard],
    component: MyProfileAlert,
  },
  {
    path: 'alerts/create',
    canLoad: [MyProfileAlertGuard],
    component: MyProfileAlertCreate,
  },
  {
    path: 'alerts/delete',
    canLoad: [MyProfileAlertGuard],
    component: MyProfileAlertDelete,
  },
  {
    path: 'alerts/edit',
    canLoad: [MyProfileAlertGuard],
    component: MyProfileAlertEdit,
  },
  {
    path: 'pending',
    canLoad: [PendingActionsGuard],
    loadChildren: () =>
      import('./PendingActions/pending-actions.module').then(
        (m) => m.PendingActionsModule,
      ),
  },
  {
    path: 'mails',
    canLoad: [MailsGuard],
    loadChildren: () =>
      import('./Mails/mails.module').then((m) => m.MailsModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileRoutingModule {}
