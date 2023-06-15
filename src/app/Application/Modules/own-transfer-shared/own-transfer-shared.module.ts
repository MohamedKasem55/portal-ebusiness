import {NgModule} from '@angular/core';
import {QuickOwnTransferStep2Component} from "./quick-own-transfer-step2/quick-own-transfer-step2.component";
import {StaticService} from "../Common/Services/static.service";
import {AppSharedModule} from "../../../core/shared/shared.module";
import { QuickOwnTransferStep3Component } from './quick-own-transfer-step3/quick-own-transfer-step3.component';
import { QuickOwnTransferStep4Component } from './quick-own-transfer-step4/quick-own-transfer-step4.component';
import {TransferOwnService} from "../Transfers/Services/transfer-own.service";


@NgModule({
    declarations: [QuickOwnTransferStep2Component, QuickOwnTransferStep3Component, QuickOwnTransferStep4Component],
    exports: [QuickOwnTransferStep2Component, QuickOwnTransferStep3Component, QuickOwnTransferStep4Component],
    providers: [StaticService,TransferOwnService],
    imports: [AppSharedModule]
})
export class OwnTransferSharedModule {
}
