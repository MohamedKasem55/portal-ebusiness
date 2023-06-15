import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
// import { AppSharedModule } from '../../../../core/shared/shared.module'

import { FinanceProductNewRequestService } from './finance-product-new-request.service'
// import { FinancProductNewRequestComponent } from './finance-product-new-request.component'

import { FinishComponent } from './Finish/finish.component'
import { InformationDetailsComponent } from './InformationDetails/information-details.component'
import { InitialOfferComponent } from './InitialOffer/initial-offer.component'
import { SummaryComponent } from './Summary/summary.component'
import { FinanceProductNewRequestRoutingModule } from './finance-product-new-request-routing.module'
// import {notEligibleModule} from "./NotEligible/not-eligible.module";
import {TranslateModule} from "@ngx-translate/core";
import { AppSharedModule } from 'app/core/shared/shared.module'
import { FinancProductNewRequestComponent } from './finance-product-new-request.component'
// import {FleetFinanceModule} from "../FleetFinance/fleet-finance-module";

@NgModule({
    imports: [
        AppSharedModule,
        BsDatepickerModule.forRoot(),
        FinanceProductNewRequestRoutingModule
    ],
  declarations: [
    FinancProductNewRequestComponent,
    InitialOfferComponent,
    InformationDetailsComponent,
    SummaryComponent,
    FinishComponent,
  ],
  providers: [FinanceProductNewRequestService],
})
export class FinancProductNewRequestModule {}
