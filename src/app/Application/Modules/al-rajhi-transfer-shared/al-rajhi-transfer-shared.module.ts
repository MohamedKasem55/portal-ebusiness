import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WithinTransferStep2Component} from './within-transfer-step2/within-transfer-step2.component';
import {WithinTransferStep3Component} from './within-transfer-step3/within-transfer-step3.component';
import {WithinTransferStep4Component} from './within-transfer-step4/within-transfer-step4.component';
import {WithinTransferStep5Component} from './within-transfer-step5/within-transfer-step5.component';
import {AppSharedModule} from "../../../core/shared/shared.module";
import {AngularTourModule} from "../../../core/tour/ng-tour.module";
import {BeneficiaryService} from "../Home/Services/beneficiary.service";
import {TransferWithinService} from "../Home/Services/transfer-within.service";


@NgModule({
    imports: [CommonModule, AppSharedModule, AngularTourModule.forChild()],
    declarations: [WithinTransferStep2Component, WithinTransferStep3Component, WithinTransferStep4Component, WithinTransferStep5Component],
    exports: [WithinTransferStep2Component, WithinTransferStep3Component, WithinTransferStep4Component, WithinTransferStep5Component],
    providers: [BeneficiaryService,TransferWithinService]
})
export class AlRajhiTransferSharedModule {
}
