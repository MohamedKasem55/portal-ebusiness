import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppSharedModule} from "../../../core/shared/shared.module";
import {BusinessHubRoutingModule} from "./business-hub.routing";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AppSharedModule,
        BusinessHubRoutingModule
    ]
})
export class BusinessHubModule {
}