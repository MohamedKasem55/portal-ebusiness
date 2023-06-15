import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { RequestStatusRoutingModule } from '../../../../Modules/Payroll/PayrollCards/RequestStatus/request-status-routing.module'
import { RequestStatusComponent } from '../../../../Modules/Payroll/PayrollCards/RequestStatus/request-status.component'
import { CardOperationComponent } from './Components/CardOperation/card-operation.component'
import { RequestReactivateOperationStep1Component } from './Components/CardOperation/reactivate/request-reactivate-step1.component'
import { RequestReactivateOperationStep2Component } from './Components/CardOperation/reactivate/request-reactivate-step2.component'
import { RequestReactivateOperationStep3Component } from './Components/CardOperation/reactivate/request-reactivate-step3.component'
import { RequestReactivateOperationComponent } from './Components/CardOperation/reactivate/request-reactivate.component'
import { RequestReactivateOperationService } from './Components/CardOperation/reactivate/request-reactivate.service'
import { CardPaymentsComponent } from './Components/CardPayments/card-payments.component'
import { RequestReactivatePaymentStep1Component } from './Components/CardPayments/reactivate/request-reactivate-step1.component'
import { RequestReactivatePaymentStep2Component } from './Components/CardPayments/reactivate/request-reactivate-step2.component'
import { RequestReactivatePaymentStep3Component } from './Components/CardPayments/reactivate/request-reactivate-step3.component'
import { RequestReactivatePaymentComponent } from './Components/CardPayments/reactivate/request-reactivate.component'
import { RequestReactivatePaymentService } from './Components/CardPayments/reactivate/request-reactivate.service'
import { RequestReactivateNewCardStep1Component } from './Components/RequestNewCardsOnline/reactivate/request-reactivate-step1.component'
import { RequestReactivateNewCardStep2Component } from './Components/RequestNewCardsOnline/reactivate/request-reactivate-step2.component'
import { RequestReactivateNewCardStep3Component } from './Components/RequestNewCardsOnline/reactivate/request-reactivate-step3.component'
import { RequestReactivateNewCardComponent } from './Components/RequestNewCardsOnline/reactivate/request-reactivate.component'
import { RequestReactivateNewCardService } from './Components/RequestNewCardsOnline/reactivate/request-reactivate.service'
import { RequestNewCardsOnlineComponent } from './Components/RequestNewCardsOnline/request-new-cards-online.component'
import { RequestReactivateUploadFileStep1Component } from './Components/UploadFiles/reactivate/request-reactivate-step1.component'
import { RequestReactivateUploadFileStep2Component } from './Components/UploadFiles/reactivate/request-reactivate-step2.component'
import { RequestReactivateUploadFileStep3Component } from './Components/UploadFiles/reactivate/request-reactivate-step3.component'
import { RequestReactivateUploadFileComponent } from './Components/UploadFiles/reactivate/request-reactivate.component'
import { RequestReactivateUploadFileService } from './Components/UploadFiles/reactivate/request-reactivate.service'
import { UploadFilesComponent } from './Components/UploadFiles/upload-files.component'
import { RequestStatusService } from './request-status.service'

@NgModule({
  imports: [
    AppSharedModule,
    RequestStatusRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    RequestStatusComponent,
    CardPaymentsComponent,
    UploadFilesComponent,
    CardOperationComponent,
    RequestNewCardsOnlineComponent,
    RequestReactivatePaymentStep1Component,
    RequestReactivatePaymentStep2Component,
    RequestReactivatePaymentStep3Component,
    RequestReactivatePaymentComponent,
    RequestReactivateOperationComponent,
    RequestReactivateOperationStep1Component,
    RequestReactivateOperationStep2Component,
    RequestReactivateOperationStep3Component,
    RequestReactivateNewCardComponent,
    RequestReactivateNewCardStep1Component,
    RequestReactivateNewCardStep2Component,
    RequestReactivateNewCardStep3Component,
    RequestReactivateUploadFileComponent,
    RequestReactivateUploadFileStep1Component,
    RequestReactivateUploadFileStep2Component,
    RequestReactivateUploadFileStep3Component,
  ],
  providers: [
    RequestStatusService,
    RequestReactivatePaymentService,
    RequestReactivateOperationService,
    RequestReactivateNewCardService,
    RequestReactivateUploadFileService,
  ],
})
export class RequestStatusModule {}
