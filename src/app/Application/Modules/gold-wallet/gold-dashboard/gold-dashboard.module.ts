import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoldDashboardRoutingModule } from './gold-dashboard-routing.module';
import { GoldDashboardComponent } from './gold-dashboard.component';
import {CurrentAccountsModule} from "../../Accounts/accounts-current-account/accounts-current.modules";
import {AppSharedModuleWithoutValidator} from "../../../../core/shared/shared-without-validator.module";


@NgModule({
  declarations: [GoldDashboardComponent],
  imports: [
    CommonModule,
    GoldDashboardRoutingModule,
    CurrentAccountsModule,
    AppSharedModuleWithoutValidator
  ]
})
export class GoldDashboardModule { }
