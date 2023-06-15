import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OnlineMerchantPortalComponent} from "./online-merchant-portal/online-merchant-portal.component";

const routes: Routes = [
    {
        path: "",
        component: OnlineMerchantPortalComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExternalApplicationRoutingModule {
}
