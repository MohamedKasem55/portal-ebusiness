import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GoldBuyRoutingModule} from './gold-buy-routing.module';
import {GoldBuyComponent} from './gold-buy.component';
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component';
import {AmountSelectComponent} from './amount-select/amount-select.component';
import {ValidationReceiptComponent} from './validation-recipt/validation-receipt.component';
import {FinishComponent} from './finish/finish.component';
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";
import {CurrentAccountsModule} from "../../Accounts/accounts-current-account/accounts-current.modules";


@NgModule({
    declarations: [GoldBuyComponent,
        TermsAndConditionsComponent,
        AmountSelectComponent,
        ValidationReceiptComponent,
        FinishComponent

    ],
    imports: [
        CommonModule,
        GoldBuyRoutingModule,
        CurrentAccountsModule,
        AppSharedModuleWithoutValidator
    ]
})
export class GoldBuyModule {
}
