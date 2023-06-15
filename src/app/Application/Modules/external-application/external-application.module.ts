import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExternalApplicationRoutingModule} from './external-application-routing.module';
import {OnlineMerchantPortalComponent} from './online-merchant-portal/online-merchant-portal.component';
import {ExternalApplicationService} from "./service/external-application.service";
import {AppSharedModuleWithoutValidator} from "../../../core/shared/shared-without-validator.module";


@NgModule({
    declarations: [OnlineMerchantPortalComponent],
    imports: [
        CommonModule,
        AppSharedModuleWithoutValidator,
        ExternalApplicationRoutingModule
    ],
    providers: [ExternalApplicationService]
})
export class ExternalApplicationModule {
}
