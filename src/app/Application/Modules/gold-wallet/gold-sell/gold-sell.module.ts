import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoldSellRoutingModule} from './gold-sell-routing.module';
import {GoldSellComponent} from './gold-sell.component';
import {SelectGoldComponent} from './select-gold/select-gold.component';
import {SelectFractionsComponent} from './select-fractions/select-fractions.component';
import {SellGoldComponent} from './sell-gold/sell-gold.component';
import {SellGoldFinishComponent} from './sell-gold-finish/sell-gold-finish.component';
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";
import {CustomFormsModule} from "ngx-custom-validators";


@NgModule({
    declarations: [GoldSellComponent,
        SelectGoldComponent,
        SelectFractionsComponent,
        SellGoldComponent,
        SellGoldFinishComponent],
    imports: [
        CommonModule,
        GoldSellRoutingModule,
        AppSharedModuleWithoutValidator,
        CustomFormsModule
    ]
})
export class GoldSellModule {
}
