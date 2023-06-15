import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RenewalComponent} from './renewal/renewal.component';
import {RenewalStep2Component} from './renewal-step2/renewal-step2.component';
import {RenewalStep3Component} from './renewal-step3/renewal-step3.component';
import {SelectedUserRenewalAlertDataService} from "../../Services/selected-user-renewal-alert-data-service";
import {RouterModule} from "@angular/router";
import {alertsRenewalRoutes} from "./alerts-renewal-routing-module";
import {AppSharedModuleWithoutValidator} from "../../../../../core/shared/shared-without-validator.module";
import {AppSharedModule} from "../../../../../core/shared/shared.module";
import {SharedModule} from "../../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
    declarations: [RenewalComponent, RenewalStep2Component, RenewalStep3Component],
    imports: [
        CommonModule,
        RouterModule.forChild(alertsRenewalRoutes),
        AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,
    ],
    providers: [SelectedUserRenewalAlertDataService]
})
export class RenewalModule {
}
