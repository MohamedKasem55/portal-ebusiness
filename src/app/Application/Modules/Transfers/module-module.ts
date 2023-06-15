import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
// General service to optain static data
import {AppSharedModule} from '../../../core/shared/shared.module'
import {ModelPipe} from '../../Components/common/Pipes/model-pipe'
import {BeneficiariesFormData} from '../Beneficiaries/Services/beneficiaries-form-data.service'
import {SharedModule} from '../shared/shared.module'
import {BreadcrumTransfer4Steps} from './Component/breadcrum-transfer-4steps.component'
import {BreadcrumTransfer5Steps} from './Component/breadcrum-transfer-5steps.component'
import {ExportFeedbackFileComponent} from './Component/export/export-feedback-file.component'
import {FeedbackPaymentsComponent} from './Component/feedback-payments.component'
import {TransfersFxRatesComponent} from './Component/fx-rates/transfers-fx-rates.component'
import {TransfersFxRatesService} from './Component/fx-rates/transfers-fx-rates.service'
import {QuickTransferStep1Widget} from './Component/home-quick-transfer-step1.component'
import {QuickTransferWidget} from './Component/home-quick-transfer.component'
import {QuickTransferStep2InternationalWidget} from './Component/international/home-quick-transfer-international-step2.component'
import {QuickTransferStep3InternationalWidget} from './Component/international/home-quick-transfer-international-step3.component'
import {QuickTransferStep4InternationalWidget} from './Component/international/home-quick-transfer-international-step4.component'
import {QuickTransferStep5InternationalWidget} from './Component/international/home-quick-transfer-international-step5.component'
import {QuickTransferStep3LocalWidget} from './Component/local/home-quick-transfer-local-step3.component'
import {QuickTransferStep4LocalWidget} from './Component/local/home-quick-transfer-local-step4.component'
import {QuickTransferStep5LocalWidget} from './Component/local/home-quick-transfer-local-step5.component'
import {QuickTransferStep6LocalWidget} from './Component/local/home-quick-transfer-local-step6.component'
import {ProcessedTransactionsComponent} from './Component/processedtransactions/processed-transactions.component'
import {ProcessedTransactionsService} from './Component/processedtransactions/processed-transactions.service'
import {RequestStatusTransferComponent} from './Component/request-status.component'
import {TransferGuard} from './Guard/transfer.guard'
import {routes} from './module-routes'
import {BeneficiaryService} from './Services/beneficiary.service'
import {RequestStatusTransferService} from './Services/request-status.service'
import {TransferInternationalService} from './Services/transfer-international.service'
import {TransferLocalService} from './Services/transfer-local.service'
import {TransferOwnService} from './Services/transfer-own.service'
import {FeedbackTransferService} from './Services/transfer.feedback.service'
import {TransferReactivationService} from './TransferReactivation/transfer-reactivation.service'
import {AppSharedModuleWithoutValidator} from '../../../core/shared/shared-without-validator.module'
import {QuickTransferStep2LocalWidget} from './Component/local/home-quick-transfer-local-step2.component'
import {BreadcrumTransfer6Steps} from './Component/breadcrum-transfer-6steps.component'
import {QuickTransferStep3IPSWidget} from './Component/ips/home-quick-transfer-quick-step3.component'
import {QuickTransferStep4IPSWidget} from './Component/ips/home-quick-transfer-quick-step4.component'
import {QuickTransferStep5IPSWidget} from './Component/ips/home-quick-transfer-quick-step5.component'
import {OwnTransferSharedModule} from "../own-transfer-shared/own-transfer-shared.module";
import {AlRajhiTransferSharedModule} from "../al-rajhi-transfer-shared/al-rajhi-transfer-shared.module";
import { ProcessedTransactionsDetailComponent } from './Component/processedtransactions/details/processed-transactions-detail.component'
import { ProcessedTransactionsDetailService } from './Component/processedtransactions/details/processed-transactions-detail.service'
import { TransferWithinService } from './Services/transfer-within.service'
import { uRPayComponent } from './uRPay/uRPay.component'
import { PayTypeComponent } from './uRPay/payType/pay-type.component'
import { PayDetailsComponent } from './uRPay/payDetails/pay-details.component'
import { URPayService } from './Services/uRPay.service'
import { PaySummaryComponent } from './uRPay/paySummary/pay-summary.component'
import { PayFinishComponent } from './uRPay/payFinish/pay-finish.component'
import {RequestToPayGuard} from "../requestToPay/requestToPay.guard";

@NgModule({
    declarations: [
        QuickTransferWidget,
        FeedbackPaymentsComponent,
        ExportFeedbackFileComponent,

        QuickTransferStep1Widget,

        QuickTransferStep2InternationalWidget,
        QuickTransferStep3InternationalWidget,
        QuickTransferStep4InternationalWidget,
        QuickTransferStep5InternationalWidget,

        QuickTransferStep2LocalWidget,
        QuickTransferStep3LocalWidget,
        QuickTransferStep4LocalWidget,
        QuickTransferStep5LocalWidget,
        QuickTransferStep6LocalWidget,

        QuickTransferStep3IPSWidget,
        QuickTransferStep4IPSWidget,
        QuickTransferStep5IPSWidget,

        RequestStatusTransferComponent,

        BreadcrumTransfer4Steps,
        BreadcrumTransfer5Steps,
        BreadcrumTransfer6Steps,

        TransfersFxRatesComponent,
        ProcessedTransactionsComponent,
        ProcessedTransactionsDetailComponent,

        uRPayComponent,
        PayTypeComponent,
        PayDetailsComponent,
        PaySummaryComponent,
        PayFinishComponent,
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        RouterModule.forChild(routes),
        SharedModule,
        BsDatepickerModule.forRoot(),
        AppSharedModuleWithoutValidator,
        OwnTransferSharedModule,
        AlRajhiTransferSharedModule],
    providers: [
        TransferOwnService,
        TransferWithinService,
        TransferLocalService,
        TransferInternationalService,
        BeneficiaryService,
        BeneficiariesFormData,
        RequestStatusTransferService,
        FeedbackTransferService,
        TransferGuard,
        ModelPipe,

        TransfersFxRatesService,
        ProcessedTransactionsService,
        ProcessedTransactionsDetailService,
        TransferReactivationService,

        URPayService,
        RequestToPayGuard,
    ],
    exports: [
        QuickTransferWidget,

        QuickTransferStep1Widget,
        QuickTransferStep2InternationalWidget,
        QuickTransferStep3InternationalWidget,
        QuickTransferStep4InternationalWidget,
        QuickTransferStep5InternationalWidget,

        QuickTransferStep2LocalWidget,
        QuickTransferStep3LocalWidget,
        QuickTransferStep4LocalWidget,
        QuickTransferStep5LocalWidget,
        QuickTransferStep6LocalWidget,

        QuickTransferStep3IPSWidget,
        QuickTransferStep4IPSWidget,
        QuickTransferStep5IPSWidget,

        BreadcrumTransfer4Steps,
        BreadcrumTransfer5Steps,
        BreadcrumTransfer6Steps,
        FeedbackPaymentsComponent,
        RequestStatusTransferComponent,

        TransfersFxRatesComponent,
    ],
})
export class ModuleImpl {
    public static routes: any = routes
}
