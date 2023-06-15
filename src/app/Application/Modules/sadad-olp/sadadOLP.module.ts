import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { ModelPipe } from '../../Components/common/Pipes/model-pipe'
import { BopComponent } from './Components/bop/bop.component'
import { SadadOlpCaEnrollmentFormComponent } from './Components/ca-enrollment/common/sadad-olp-ca-enrollment-form.component'
import { SadadOlpCaEnrollmentComponent } from './Components/ca-enrollment/sadad-olp-ca-enrollment.component'
import { SadadOlpCaEnrollmentService } from './Components/ca-enrollment/sadad-olp-ca-enrollment.service'
import { Step1Component as CAEnrollmentStep1Component } from './Components/ca-enrollment/Steps/Step1/step1.component'
import { Step2Component as CAEnrollmentStep2Component } from './Components/ca-enrollment/Steps/Step2/step2.component'
import { Step3Component as CAEnrollmentStep3Component } from './Components/ca-enrollment/Steps/Step3/step3.component'
import { DisputesDetailComponent } from './Components/disputes/dispute-detail/view-disputes-detail.component'
import { DisputeSadadOLPGuard } from './Components/disputes/dispute-sadad-olp.guard'
import { OLPDisputesListComponent } from './Components/disputes/list/olp-disputes-list.component'
import { OLPDisputesListService } from './Components/disputes/list/olp-disputes-list.service'
import { ManageOLPDisputeEntityService } from './Components/disputes/olp-disputes-entity.service'
import { CloseOLPNotificationsComponent } from './Components/notifications/close/close-notifications.component'
import { CloseOLPNotificationsGuard } from './Components/notifications/close/close-notifications.guard'
import { CloseOLPNotificationsService } from './Components/notifications/close/close-notifications.service'
import { Step1Component as CloseNotificationOlpStep1Component } from './Components/notifications/close/Steps/Step1/step1.component'
import { Step2Component as CloseNotificationOlpStep2Component } from './Components/notifications/close/Steps/Step2/step2.component'
import { OLPNotificationsListComponent } from './Components/notifications/list/olp-notifications-list.component'
import { OLPNotificationsListService } from './Components/notifications/list/olp-notifications-list.service'
import { ManageOLPNotificationEntityService } from './Components/notifications/olp-notifications-entity.service'
import { OLPRefundFormComponent } from './Components/refunds/common/olp-refunds-form.component'
import { OLPRefundListComponent } from './Components/refunds/list/olp-refunds-list.component'
import { OLPRefundListService } from './Components/refunds/list/olp-refunds-list.service'
import { ManageOLPRefundEntityService } from './Components/refunds/refund-sadad-olp-entity.service'
import { RefundSadadOLPComponent } from './Components/refunds/refund-sadad-olp.component'
import { RefundSadadOLPGuard } from './Components/refunds/refund-sadad-olp.guard'
import { RefundSadadOLPService } from './Components/refunds/refund-sadad-olp.service'
import { Step1Component as RefundSadadOlpStep1Component } from './Components/refunds/Steps/Step1/step1.component'
import { Step2Component as RefundSadadOlpStep2Component } from './Components/refunds/Steps/Step2/step2.component'
import { Step3Component as RefundSadadOlpStep3Component } from './Components/refunds/Steps/Step3/step3.component'
import { Step4Component as RefundSadadOlpStep4Component } from './Components/refunds/Steps/Step4/step4.component'
import { RequestStatusDisputeFormComponent } from './Components/request-status/action/common/request-status-disputes-form.component'
import { RequestStatusRefundFormComponent } from './Components/request-status/action/common/request-status-refunds-form.component'
import { RequestStatusActionComponent } from './Components/request-status/action/request-status-action.component'
import { RequestStatusActionGuard } from './Components/request-status/action/request-status-action.guard'
import { RequestStatusActionService } from './Components/request-status/action/request-status-action.service'
import { Step1Component as RequestStatusActionStep1Component } from './Components/request-status/action/Steps/Step1/step1.component'
import { Step2Component as RequestStatusActionStep2Component } from './Components/request-status/action/Steps/Step2/step2.component'
import { Step3Component as RequestStatusActionStep3Component } from './Components/request-status/action/Steps/Step3/step3.component'
import { RequestStatusDisputesListComponent } from './Components/request-status/list/disputes/request-status-disputes-list.component'
import { RequestStatusDisputesListService } from './Components/request-status/list/disputes/request-status-disputes-list.service'
import { RequestStatusRefundsListComponent } from './Components/request-status/list/refunds/request-status-refunds-list.component'
import { RequestStatusRefundsListService } from './Components/request-status/list/refunds/request-status-refunds-list.service'
import { OLPRequestStatusListComponent } from './Components/request-status/list/request-status-list.component'
import { OLPRequestStatusListService } from './Components/request-status/list/request-status-list.service'
import { ManageRequestStatusDisputesEntityService } from './Components/request-status/request-status-disputes-entity.service'
import { ManageRequestStatusRefundsEntityService } from './Components/request-status/request-status-refunds-entity.service'
import { RequestStatusSadadOLPGuard } from './Components/request-status/request-status-sadad-olp.guard'
import { InitiateSadadTestingComponent } from './Components/testing/initiate/initiate-sadad-testing.component'
import { InitiateSadadTestingGuard } from './Components/testing/initiate/initiate-sadad-testing.guard'
import { InitiateSadadTestingService } from './Components/testing/initiate/initiate-sadad-testing.service'
import { InitiateSadadTestingListComponent } from './Components/testing/initiate/list/initiate-sadad-testing-list.component'
import { InitiateSadadTestingListService } from './Components/testing/initiate/list/initiate-sadad-testing-list.service'
import { Step1Component as InitiateSadadTestingStep1Component } from './Components/testing/initiate/Steps/Step1/step1.component'
import { Step2Component as InitiateSadadTestingStep2Component } from './Components/testing/initiate/Steps/Step2/step2.component'
import { ViewSadadTestingDetailComponent } from './Components/testing/view/details/view-sadad-testing-detail.component'
import { ManageTestingOLPEntityService } from './Components/testing/view/details/view-sadad-testing-entity.service'
import { ViewSadadTestingListComponent } from './Components/testing/view/list/view-sadad-testing-list.component'
import { ViewSadadTestingListService } from './Components/testing/view/list/view-sadad-testing-list.service'
import { Step1Component as ViewSadadTestingStep1Component } from './Components/testing/view/Steps/Step1/step1.component'
import { Step2Component as ViewSadadTestingStep2Component } from './Components/testing/view/Steps/Step2/step2.component'
import { ViewSadadTestingComponent } from './Components/testing/view/view-sadad-testing.component'
import { ViewSadadTestingGuard } from './Components/testing/view/view-sadad-testing.guard'
import { ViewSadadTestingService } from './Components/testing/view/view-sadad-testing.service'
import { OLPTransactionsListComponent } from './Components/transactions/list/olp-transactions-list.component'
import { OLPTransactionsListService } from './Components/transactions/list/olp-transactions-list.service'
import { ManageOLPTransactionEntityService } from './Components/transactions/olp-transactions-entity.service'
import { ServiceOLPStatusPipe } from './Pipe/getServiceOLPStatus-pipe'
import { SadadOLPRoutingModule } from './sadadOLP-routing.module'

@NgModule({
  declarations: [
    BopComponent,
    OLPRefundListComponent,
    RefundSadadOLPComponent,
    RefundSadadOlpStep1Component,
    OLPNotificationsListComponent,
    RefundSadadOlpStep2Component,
    OLPRefundFormComponent,
    CloseNotificationOlpStep1Component,
    CloseNotificationOlpStep2Component,
    CloseOLPNotificationsComponent,
    RefundSadadOlpStep3Component,
    RefundSadadOlpStep4Component,
    InitiateSadadTestingComponent,
    InitiateSadadTestingStep1Component,
    InitiateSadadTestingStep2Component,
    InitiateSadadTestingListComponent,
    ViewSadadTestingListComponent,
    ViewSadadTestingComponent,
    ViewSadadTestingStep1Component,
    ViewSadadTestingStep2Component,
    ViewSadadTestingDetailComponent,
    OLPTransactionsListComponent,
    SadadOlpCaEnrollmentComponent,
    CAEnrollmentStep1Component,
    CAEnrollmentStep2Component,
    CAEnrollmentStep3Component,
    SadadOlpCaEnrollmentFormComponent,
    ServiceOLPStatusPipe,
    OLPDisputesListComponent,
    DisputesDetailComponent,
    OLPRequestStatusListComponent,
    RequestStatusRefundsListComponent,
    RequestStatusDisputesListComponent,
    RequestStatusActionComponent,
    RequestStatusActionStep1Component,
    RequestStatusRefundFormComponent,
    RequestStatusDisputeFormComponent,
    RequestStatusActionStep2Component,
    RequestStatusActionStep3Component,
  ],
  providers: [
    RefundSadadOLPGuard,
    RefundSadadOLPService,
    OLPRefundListService,
    OLPNotificationsListService,
    ManageOLPRefundEntityService,
    ManageOLPNotificationEntityService,
    CloseOLPNotificationsGuard,
    CloseOLPNotificationsService,
    InitiateSadadTestingGuard,
    InitiateSadadTestingService,
    InitiateSadadTestingListService,
    ViewSadadTestingListService,
    ViewSadadTestingGuard,
    ViewSadadTestingService,
    ManageTestingOLPEntityService,
    ManageOLPTransactionEntityService,
    OLPTransactionsListService,
    SadadOlpCaEnrollmentService,
    OLPDisputesListService,
    DisputeSadadOLPGuard,
    ManageOLPDisputeEntityService,
    ManageRequestStatusDisputesEntityService,
    ManageRequestStatusRefundsEntityService,
    OLPRequestStatusListService,
    RequestStatusSadadOLPGuard,
    RequestStatusRefundsListService,
    RequestStatusDisputesListService,
    RequestStatusActionGuard,
    RequestStatusActionService,
    ModelPipe,
  ],
  exports: [
    RefundSadadOlpStep1Component,
    RefundSadadOlpStep2Component,
    OLPRefundFormComponent,
    CloseNotificationOlpStep1Component,
    CloseNotificationOlpStep2Component,
    RefundSadadOlpStep3Component,
    RefundSadadOlpStep4Component,
    InitiateSadadTestingStep1Component,
    InitiateSadadTestingStep2Component,
    ViewSadadTestingStep1Component,
    ViewSadadTestingStep2Component,
    RequestStatusActionStep1Component,
    RequestStatusActionStep2Component,
    RequestStatusActionStep3Component,
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    AppSharedModule,
    SadadOLPRoutingModule,
  ],
})
export class SadadOLPModule {}
