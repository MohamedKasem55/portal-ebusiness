import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AppSharedModule} from "../../../core/shared/shared.module";
import {RouterModule} from "@angular/router";
import {routes} from "./requestToPay-routing.module";
import {SharedModule} from "../shared/shared.module";
import {RequestToPayComponent} from "./requestToPay.component";
import {RequestToPayGuard} from "./requestToPay.guard";
import {RequestToPayService} from "./requestToPay.service";
import {RequestToPayNewRequestComponent} from "./new-request/requestToPay-new-request.component";
import {BeneficiariesComponent} from "./beneficiaries/beneficiaries.component";
import {BeneficiaryService} from "../Transfers/Services/beneficiary.service";
import {RequestToPayRequestDetailsComponent} from "./request-details/request-details.component";


@NgModule({
    imports: [
        CommonModule,
        AppSharedModule,
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        RequestToPayComponent,
        RequestToPayNewRequestComponent,
        BeneficiariesComponent,
        RequestToPayRequestDetailsComponent,
    ],
    providers: [
        RequestToPayGuard,
        RequestToPayService,
        BeneficiaryService,
    ],

    exports: [RequestToPayComponent],
})
export class RequestToPayModule {
}
