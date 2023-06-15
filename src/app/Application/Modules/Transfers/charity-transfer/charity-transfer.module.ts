import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityServicesComponent } from './community-services/community-services.component';
import { SingleCharityTransferComponent } from './single-charity-transfer/single-charity-transfer.component';
import {CharityTransferRoutingModule} from "./charity-transfer-routing.module";
import {ArbDesignComponentModule} from "arb-design";
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";
import {AccountBalanceService} from "../../Home/Services/account-balance-service";



@NgModule({
  declarations: [CommunityServicesComponent, SingleCharityTransferComponent],
    imports: [
        CharityTransferRoutingModule,
        CommonModule,
        ArbDesignComponentModule,
        AppSharedModuleWithoutValidator
    ],
    providers: [
        AccountBalanceService
    ]
})
export class CharityTransferModule { }
