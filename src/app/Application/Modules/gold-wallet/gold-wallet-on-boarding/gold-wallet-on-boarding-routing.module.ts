import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GoldWalletOnBoardingComponent} from "./gold-wallet-on-boarding.component";

const routes: Routes = [
    {
        path: '',
        component: GoldWalletOnBoardingComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoldWalletOnBoardingRoutingModule {
}
