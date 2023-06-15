import { NgModule } from '@angular/core';
import { QoyodDashboardComponent } from './qoyod-dashboard/qoyod-dashboard.component';
import {QoyodRoutingModule} from "./qoyod.module-routing";
import { QoyodRegisterComponent } from './qoyod-register/qoyod-register.component';
import {QoyodDashboardGard} from "./qoyod-dashboard/qoyod-dashboard-gaurd";
import {MonthlyStatisticsModule} from "../../InvoiceHUB/Reports/monthly-statistics.module";
import {AppSharedModule} from "../../../../core/shared/shared.module";

@NgModule({
  declarations: [QoyodDashboardComponent, QoyodRegisterComponent],
    imports: [
        QoyodRoutingModule,
        MonthlyStatisticsModule,
        AppSharedModule,
    ],
    providers:[QoyodDashboardGard]
})
export class QoyodModule { }
