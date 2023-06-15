import { NgModule } from '@angular/core'
import { AppSharedModuleWithoutValidator } from '../../../core/shared/shared-without-validator.module'
import { StaticService } from '../Common/Services/static.service'
import { GovernmentRevenueRoutingModule } from './government-revenue-routing.module'
import { NewPaymentGuard } from './Guard/new-payment.guard'
import { PreviousPaymentGuard } from './Guard/previous-payment.guard'
import { RequestStatusGuard } from './Guard/request-status.guard'
import { GovernmentRevenueService } from './Services/government-revenue.service'
import { SharedModule } from '../shared/shared.module'
import { UploadFileService } from './Components/UploadFile/upload-file.service'
import { FileUploadStep3Component } from './Components/UploadFile/upload-file-step3.component'
import { FileUploadStep2Component } from './Components/UploadFile/upload-file-step2.component'
import { UploadFileComponent } from './Components/UploadFile/upload-file.component'
import { UploadFileGuard } from './Guard/upload-file.guard'
import { OriginatorTableComponent } from './Components/Common/originator-table.component'
import { GovernmentRevenueComponent } from './Components/government-revenue.component'
import { FileUploadStep1Component } from './Components/UploadFile/upload-file-step1.component'
import { GovernmentRevenueOptionsComponent } from './Components/government-revenue-options.component'
import { TableDepositorsBeneficiariesTabularDetailsComponent } from './Components/Common/table-depositors-beneficiaries-tabular-details.component'
import { WizardStep1Component } from './Components/Common/wizard-step-1.component'
import { WizardStep2Component } from './Components/Common/wizard-step-2.component'
import { WizardStep3Component } from './Components/Common/wizard-step-3.component'
import { RevenueAccountsTableComponent } from './Components/Common/revenue-accounts-table.component'
import { PreviousPaymentsComponent } from './Components/PreviousPayments/previous-payments.component'
import { RequestStatusComponent } from './Components/RequestStatus/request-status.component'
import { FileUploadRequestStatusDetailsComponent } from './Components/RequestStatus/detailsbatch/upload-file-details.component'
import { RequestStatusService } from './Components/RequestStatus/request-status.service'
import { ProcessedOperationComponent } from './Components/ProcessedOperations/processed-operation.component'
import { ProcessedOperationService } from './Components/ProcessedOperations/processed-operation.service'
import { GovernmentRevenueProcessedOperationDetailComponent } from './Components/ProcessedOperations/details/government-revenue-processed-operation-detail.component'
import { RequestReactivateComponent } from './Components/RequestStatus/RequestReactivate/request-reactivate.component'
import { FileUploadExportableModule } from '../Payroll/PayrollManagement/FileUpload/file-upload-exportable-module'
@NgModule({
    declarations: [
        GovernmentRevenueComponent,
        UploadFileComponent,
        FileUploadStep1Component,
        FileUploadStep2Component,
        FileUploadStep3Component,
        RequestStatusComponent,
        WizardStep1Component,
        WizardStep2Component,
        WizardStep3Component,
        OriginatorTableComponent,
        RevenueAccountsTableComponent,
        PreviousPaymentsComponent,
        RequestReactivateComponent,
        GovernmentRevenueOptionsComponent,
        TableDepositorsBeneficiariesTabularDetailsComponent,
        FileUploadRequestStatusDetailsComponent,
        ProcessedOperationComponent,
        GovernmentRevenueProcessedOperationDetailComponent,
    ],
    imports: [AppSharedModuleWithoutValidator, GovernmentRevenueRoutingModule, SharedModule,FileUploadExportableModule],
    providers: [
        StaticService,
        UploadFileService,
        UploadFileGuard,
        GovernmentRevenueService,
        RequestStatusService,
        ProcessedOperationService,
        NewPaymentGuard,
        RequestStatusGuard,
        PreviousPaymentGuard,
    ],
    exports: [
        TableDepositorsBeneficiariesTabularDetailsComponent
    ]
})
export class GovernmentRevenueModule { }
