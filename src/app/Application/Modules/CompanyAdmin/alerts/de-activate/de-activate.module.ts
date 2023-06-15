import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeActivateComponent} from './de-activate/de-activate.component';
import {DeActivateStep2Component} from './de-activate-step2/de-activate-step2.component';
import {DeActivateStep3Component} from './de-activate-step3/de-activate-step3.component';
import {SelectedUserDesactivateAlertDataService} from "../../Services/selected-user-desactivate-alert-data-service";
import {RouterModule} from "@angular/router";
import {alertsDeActivateRoutes} from "./alerts-de-activate-routing-module";
import {AppSharedModule} from "../../../../../core/shared/shared.module";
import {AppSharedModuleWithoutValidator} from "../../../../../core/shared/shared-without-validator.module";
import {SharedModule} from "../../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
    declarations: [DeActivateComponent, DeActivateStep2Component, DeActivateStep3Component],
    imports: [
        CommonModule,
        RouterModule.forChild(alertsDeActivateRoutes),
        AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,
    ],
    providers: [SelectedUserDesactivateAlertDataService]
})
export class DeActivateModule {
}
