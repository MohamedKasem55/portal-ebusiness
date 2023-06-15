import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportComponent} from './report/report.component';
import {RouterModule} from "@angular/router";
import {alertsReportsRoutes} from "./alerts-report-routing-module";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {AppSharedModuleWithoutValidator} from "../../../../../core/shared/shared-without-validator.module";
import {AppSharedModule} from "../../../../../core/shared/shared.module";
import {SharedModule} from "../../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
    declarations: [ReportComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(alertsReportsRoutes),
        AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,
    ]
})
export class ReportModule {
}
