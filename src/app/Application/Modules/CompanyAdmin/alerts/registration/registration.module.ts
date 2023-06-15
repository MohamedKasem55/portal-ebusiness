import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertsRegistrationComponent} from './alerts-registration/alerts-registration.component';
import {AlertsRegistrationStep2Component} from './alerts-registration-step2/alerts-registration-step2.component';
import {AlertsRegistrationStep3Component} from './alerts-registration-step3/alerts-registration-step3.component';
import {RouterModule} from "@angular/router";
import {alertsRegistrationRoutes} from "./alerts-registration-routing-module";
import {AppSharedModuleWithoutValidator} from "../../../../../core/shared/shared-without-validator.module";
import {AppSharedModule} from "../../../../../core/shared/shared.module";
import {SharedModule} from "../../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
    declarations: [AlertsRegistrationComponent, AlertsRegistrationStep2Component, AlertsRegistrationStep3Component],
    imports: [CommonModule, RouterModule.forChild(alertsRegistrationRoutes), AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,]
})
export class RegistrationModule {
}
