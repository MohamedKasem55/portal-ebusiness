import { ViewCardCredentialsModule } from './../../ViewCardCredentials/view-card-credentials.module';
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {AppSharedModule} from '../../../../core/shared/shared.module'
import {PrePaidCardListComponent} from './prePaidCardList.component'
import {PrePaidCardsListRoutingModule} from './prePaidCardList.routing.module'
import {PrePaidCardListService} from './prePaidCardList.service'
import {PrePaidCardResetPINModule} from "../PrePaidCardReset/module-module";
import {PrePaidCardPaymentModule} from "../PrePaidCardPayment/module-module";
import {PrePaidCardBlockModule} from "../PrePaidCardBlock/module-module";
import {PrePaidCardBlockService} from "../PrePaidCardBlock/prePaidCardBlock.service";
import {PrePaidCardsActivateModule} from "../PrePaidCardActivate/module-module";

@NgModule({
    imports: [
        AppSharedModule,
        FormsModule,
        PrePaidCardsListRoutingModule,
        PrePaidCardResetPINModule,
        PrePaidCardPaymentModule,
        PrePaidCardBlockModule,
        PrePaidCardsActivateModule,
        ViewCardCredentialsModule
    ],
    declarations: [PrePaidCardListComponent],
    exports: [PrePaidCardListComponent],
    providers: [PrePaidCardListService, PrePaidCardBlockService],
})
export class PrePaidCardsListModule {
}
