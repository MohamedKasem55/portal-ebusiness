import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoldDashboardComponent} from "./gold-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: GoldDashboardComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoldDashboardRoutingModule {
}
