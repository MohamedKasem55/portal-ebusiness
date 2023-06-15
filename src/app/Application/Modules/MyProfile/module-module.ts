import { WorkflowDetailsService } from './Services/workflow-details.service'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { ModelPipe } from '../../Components/common/Pipes/model-pipe'
import { MyProfileActivityLogs } from '../../Modules/MyProfile/Component/my-profile-activity-logs.component'
import { MyProfileAlertCreate } from '../../Modules/MyProfile/Component/my-profile-alert-create.component'
import { MyProfileAlertDelete } from '../../Modules/MyProfile/Component/my-profile-alert-delete.component'
import { MyProfileAlertEdit } from '../../Modules/MyProfile/Component/my-profile-alert-edit.component'
import { MyProfileAlert } from '../../Modules/MyProfile/Component/my-profile-alert.component'
import { MyProfileRoutingModule } from '../../Modules/MyProfile/module-routes'
import { AlertSelectedPipe } from '../../Modules/MyProfile/Services/alert-selected-pipe'
import { MyProfileActivityLogsService } from '../../Modules/MyProfile/Services/my-profile-activity-logs.service'
import { MyProfileAlertService } from '../../Modules/MyProfile/Services/my-profile-alert.service'
import { StaticService } from '../Common/Services/static.service'
import { SharedModule } from '../shared/shared.module'
import { MyProfileActivityLogsList } from './Component/my-profile-activity-logs-list.component'
import { MyProfileOperationDetail } from './Component/my-profile-operation-detail.component'
import { MyProfileRequestedFiles } from './Component/my-profile-requested-files.component'
import { MyProfileActivityLogsAdminGuard } from './Guard/my-profile-activity-logs-admin.guard'
import { MyProfileActivityLogsGuard } from './Guard/my-profile-activity-logs.guard'
import { MyProfileAlertGuard } from './Guard/my-profile-alert.guard'
import { MailsGuard } from './Mails/mails.guard'
import { routes } from './module-routes'
import { PendingActionsGuard } from './PendingActions/pending-actions.guard'
import { MyProfileStaticService } from './Services/my-profile-static.service'

@NgModule({
  declarations: [
    MyProfileActivityLogsList,
    MyProfileActivityLogs,
    MyProfileAlert,
    MyProfileAlertCreate,
    MyProfileAlertDelete,
    MyProfileAlertEdit,
    MyProfileRequestedFiles,
    MyProfileOperationDetail,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    MyProfileRoutingModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot(),
  ],
  providers: [
    MyProfileActivityLogsService,
    MyProfileAlertService,
    MyProfileStaticService,
    StaticService,
    AlertSelectedPipe,
    MyProfileActivityLogsGuard,
    MyProfileActivityLogsAdminGuard,
    MyProfileAlertGuard,
    PendingActionsGuard,
    MailsGuard,
    ModelPipe,
    WorkflowDetailsService,
  ],
  exports: [
    MyProfileActivityLogsList,
    MyProfileActivityLogs,
    MyProfileAlert,
    MyProfileAlertCreate,
    MyProfileAlertDelete,
    MyProfileAlertEdit,
    MyProfileRequestedFiles,
    MyProfileOperationDetail,
  ],
})
export class ModuleImpl {
  public static routes: any = routes
}
