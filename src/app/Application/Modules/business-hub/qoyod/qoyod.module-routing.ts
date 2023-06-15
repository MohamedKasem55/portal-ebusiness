import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {QoyodDashboardComponent} from "./qoyod-dashboard/qoyod-dashboard.component";
import {QoyodRegisterComponent} from "./qoyod-register/qoyod-register.component";
import {QoyodDashboardGard} from "./qoyod-dashboard/qoyod-dashboard-gaurd";
import {QoyodDashboardResolver} from "./qoyod-dashboard/qoyod-dashboard-resolver";

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [QoyodDashboardGard],
    component: QoyodDashboardComponent,
    resolve: {
      resolver: QoyodDashboardResolver
    }
  },
  {
    path: 'register',
    component: QoyodRegisterComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QoyodRoutingModule {}
