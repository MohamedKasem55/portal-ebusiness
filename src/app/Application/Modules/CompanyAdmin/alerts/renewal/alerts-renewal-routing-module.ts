import {Routes} from "@angular/router/router";
import {RenewalComponent} from "./renewal/renewal.component";
import {RenewalStep2Component} from "./renewal-step2/renewal-step2.component";
import {RenewalStep3Component} from "./renewal-step3/renewal-step3.component";
import {AuthGuardCompanyadminAlerts} from "../../auth-guard-companyadmin-alerts.service";


export const alertsRenewalRoutes: Routes = [
    {
        path: '',
        component: RenewalComponent,
        canLoad: [AuthGuardCompanyadminAlerts],
    },
    {
        path: 'renewal2',
        component: RenewalStep2Component,
        canLoad: [AuthGuardCompanyadminAlerts],
    },
    {
        path: 'renewal3',
        component: RenewalStep3Component,
        canLoad: [AuthGuardCompanyadminAlerts],
    },
]
