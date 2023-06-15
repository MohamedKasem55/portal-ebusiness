import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoldWalletRoutingModule} from './gold-wallet-routing.module';
import {AppSharedModule} from "../../../core/shared/shared.module";
import {GoldWalletService} from "./service/gold-wallet.service";
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {GoldWalletComponent} from './gold-wallet/gold-wallet.component';


@NgModule({
    imports: [
        CommonModule,
        AppSharedModule,
        GoldWalletRoutingModule
    ],
    providers: [GoldWalletService],
    declarations: [TransactionDetailsComponent, GoldWalletComponent]
})
export class GoldWalletModule {
}
