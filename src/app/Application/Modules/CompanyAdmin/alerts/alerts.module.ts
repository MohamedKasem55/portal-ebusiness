import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {alertsRoutes} from "./alerts-routing-module";
import {RouterModule} from "@angular/router";
import {AlertsComponent} from './alerts.component';
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";
import {AppSharedModule} from "../../../../core/shared/shared.module";
import {SharedModule} from "../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {AuthGuardCompanyadminAlerts} from "../auth-guard-companyadmin-alerts.service";


@NgModule({
    declarations: [AlertsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(alertsRoutes),
        AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,
    ], providers: [AuthGuardCompanyadminAlerts]
})
export class AlertsModule {
}
