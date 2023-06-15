import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransactionDetailsComponent} from "./transaction-details/transaction-details.component";
import {GoldWalletComponent} from "./gold-wallet/gold-wallet.component";

const routes: Routes = [
    {
        path: '',
        component: GoldWalletComponent,
    },
    {
        path: 'dashboard',
        loadChildren: () => import('../gold-wallet/gold-dashboard/gold-dashboard.module')
            .then((m) => m.GoldDashboardModule)
    },
    {
        path: 'on-boarding',
        loadChildren: () => import('../gold-wallet/gold-wallet-on-boarding/gold-wallet-on-boarding.module')
            .then((m) => m.GoldWalletOnBoardingModule)
    },
    {
        path: 'buy',
        loadChildren: () => import('../gold-wallet/gold-buy/gold-buy.module')
            .then((m) => m.GoldBuyModule)
    },
    {
        path: 'sell',
        loadChildren: () => import('../gold-wallet/gold-sell/gold-sell.module')
            .then((m) => m.GoldSellModule)
    },
    {
        path: 'trnx-details',
        component: TransactionDetailsComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoldWalletRoutingModule {
}
