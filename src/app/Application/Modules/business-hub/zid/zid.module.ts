import { NgModule } from '@angular/core';
import { ZidDashboardComponent } from './zid-dashboard/zid-dashboard.component';
import {ZidRoutingModule} from "./zid.module-routing";
import { ZidRegisterComponent } from './zid-register/zid-register.component';
import {ZidDashboardGard} from "./zid-dashboard/zid-dashboard-gaurd";
import {AppSharedModule} from "../../../../core/shared/shared.module";



@NgModule({
  declarations: [ZidDashboardComponent, ZidRegisterComponent],
    imports: [
        ZidRoutingModule,
        AppSharedModule
    ],
    providers:[ZidDashboardGard]
})
export class ZidModule { }
