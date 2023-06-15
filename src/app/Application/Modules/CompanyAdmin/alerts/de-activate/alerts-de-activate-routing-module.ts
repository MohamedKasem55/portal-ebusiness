import {Routes} from "@angular/router/router";

import {DeActivateComponent} from "./de-activate/de-activate.component";
import {DeActivateStep2Component} from "./de-activate-step2/de-activate-step2.component";
import {DeActivateStep3Component} from "./de-activate-step3/de-activate-step3.component";
import {AuthGuardCompanyadminAlerts} from "../../auth-guard-companyadmin-alerts.service";


export const alertsDeActivateRoutes: Routes = [
    {
        path: '',
        canLoad: [AuthGuardCompanyadminAlerts],
        component: DeActivateComponent,
    },
    {
        path: 'desactivate2',
        canLoad: [AuthGuardCompanyadminAlerts],
        component: DeActivateStep2Component,
    },
    {
        path: 'desactivate3',
        component: DeActivateStep3Component,
    }
]
