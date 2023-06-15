import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {ZidDashboardComponent} from "./zid-dashboard/zid-dashboard.component";
import {ZidDashboardGard} from "./zid-dashboard/zid-dashboard-gaurd";
import {ZidRegisterComponent} from "./zid-register/zid-register.component";
import {ZidDashboardResolver} from "./zid-dashboard/zid-dashboard-resolver";

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [ZidDashboardGard],
    component: ZidDashboardComponent,
    resolve: {
      resolver: ZidDashboardResolver
    }
  },
  {
    path: 'register',
    component: ZidRegisterComponent
  }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZidRoutingModule {}
