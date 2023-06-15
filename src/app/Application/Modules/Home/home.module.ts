import {NgModule} from '@angular/core'
import {AngularTourModule} from '../../../core/tour/ng-tour.module'
import {AppSharedModule} from '../../../core/shared/shared.module'
import {SharedModule} from '../shared/shared.module'
import {BreadcrumTransfer4Steps} from './Component/breadcrum-transfer-4steps.component'
import {BreadcrumTransfer5Steps} from './Component/breadcrum-transfer-5steps.component'
import {CampaignMessageComponent} from './Component/campaign-message/campaign-message.component'
import {HomeMainComponent} from './Component/home-main.component'
import {QuickTransferStep1Widget} from './Component/home-quick-transfer-step1.component'
import {QuickTransferWidget} from './Component/home-quick-transfer.component'
import {InformationTableComponent} from './Component/information-table/information-table.component'
import {QuickTransferStep2InternationalWidget} from './Component/international/home-quick-transfer-international-step2.component'
import {QuickTransferStep3InternationalWidget} from './Component/international/home-quick-transfer-international-step3.component'
import {QuickTransferStep4InternationalWidget} from './Component/international/home-quick-transfer-international-step4.component'
import {QuickTransferStep5InternationalWidget} from './Component/international/home-quick-transfer-international-step5.component'
import {QuickTransferStep2LocalWidget} from './Component/local/home-quick-transfer-local-step2.component'
import {QuickTransferStep3LocalWidget} from './Component/local/home-quick-transfer-local-step3.component'
import {QuickTransferStep4LocalWidget} from './Component/local/home-quick-transfer-local-step4.component'
import {QuickTransferStep5LocalWidget} from './Component/local/home-quick-transfer-local-step5.component'
import {HomeRoutingModule} from './home-routing.module'
import {InformationComponent} from './information/information.component'
import {AccountBalanceService} from './Services/account-balance-service'
import {BeneficiaryService} from './Services/beneficiary.service'
import {HomeMainService} from './Services/home-main.services'
import {TransferInternationalService} from './Services/transfer-international.service'
import {TransferLocalService} from './Services/transfer-local.service'
import {TransferOwnService} from './Services/transfer-own.service'
import {TransferWithinService} from './Services/transfer-within.service'
import {ManageAccountsWidgetComponent} from './Component/manage-accounts-widget/manage-accounts-widget.component'
import {InformationDataComponent} from './Component/information-data/information-data.component'
import {CommercialCardsHomeComponent} from './commercialCardsHome/commercialCardsHome.component'
import {CarouselCommercialCards} from './Component/carousel-commercialCards/carousel-commercialCards.component'
import {PrePaidCardsComponent} from './pre-paid-cards/pre-paid-cards.component';
import {CarouselPrePaidCardsComponent} from './Component/carousel-pre-paid-cards/carousel-pre-paid-cards.component'
import {PrePaidCardService} from "../PrePaidCard/prePaidCard.service";
import {AlRajhiTransferSharedModule} from "../al-rajhi-transfer-shared/al-rajhi-transfer-shared.module";
import {OwnTransferSharedModule} from "../own-transfer-shared/own-transfer-shared.module";
import {BusinessFinanceManagementComponent} from "./business-finance-managment/business-finance-management.component";
import {BusinessFinManagementService} from "./Services/business-fin-management.service";

@NgModule({
    imports: [
        AppSharedModule,
        HomeRoutingModule,
        SharedModule,
        AngularTourModule.forChild(),
        AlRajhiTransferSharedModule,
        OwnTransferSharedModule,

    ],

    declarations: [
        HomeMainComponent,
        QuickTransferWidget,
        BreadcrumTransfer4Steps,
        BreadcrumTransfer5Steps,
        QuickTransferStep1Widget,
        QuickTransferStep2InternationalWidget,
        QuickTransferStep3InternationalWidget,
        QuickTransferStep4InternationalWidget,
        QuickTransferStep5InternationalWidget,
        QuickTransferStep2LocalWidget,
        QuickTransferStep3LocalWidget,
        QuickTransferStep4LocalWidget,
        QuickTransferStep5LocalWidget,
        CampaignMessageComponent,
        InformationComponent,
        InformationTableComponent,
        ManageAccountsWidgetComponent,
        InformationDataComponent,
        CommercialCardsHomeComponent,
        InformationComponent,
        InformationTableComponent,
        CarouselCommercialCards,
        PrePaidCardsComponent,
        CarouselPrePaidCardsComponent,
        BusinessFinanceManagementComponent,
    ],

    providers: [
        AccountBalanceService,
        BeneficiaryService,
        TransferInternationalService,
        TransferLocalService,
        TransferOwnService,
        TransferWithinService,
        HomeMainService,
        PrePaidCardService,
        BusinessFinManagementService
    ],
})
export class HomeModule {
}
