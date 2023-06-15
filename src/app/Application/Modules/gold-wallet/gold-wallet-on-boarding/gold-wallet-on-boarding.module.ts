import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GoldWalletOnBoardingRoutingModule} from './gold-wallet-on-boarding-routing.module';
import {GoldWalletOnBoardingComponent} from './gold-wallet-on-boarding.component';
import {GoldWalletTermsAndConditionsComponent} from './gold-wallet-terms-and-conditions/gold-wallet-terms-and-conditions.component';
import {GoldWalletSelectAccountComponent} from './gold-wallet-select-account/gold-wallet-select-account.component';
import {GoldWalletSummaryComponent} from './gold-wallet-summary/gold-wallet-summary.component';
import {GoldWalletFinishComponent} from './gold-wallet-finish/gold-wallet-finish.component';
import {CurrentAccountsModule} from "../../Accounts/accounts-current-account/accounts-current.modules";
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";


@NgModule({
    declarations: [GoldWalletOnBoardingComponent,
        GoldWalletTermsAndConditionsComponent,
        GoldWalletSelectAccountComponent,
        GoldWalletSummaryComponent,
        GoldWalletFinishComponent],
    exports: [
        GoldWalletTermsAndConditionsComponent
    ],
    imports: [
        CommonModule,
        GoldWalletOnBoardingRoutingModule,
        CurrentAccountsModule,
        AppSharedModuleWithoutValidator
    ]
})
export class GoldWalletOnBoardingModule {
}
