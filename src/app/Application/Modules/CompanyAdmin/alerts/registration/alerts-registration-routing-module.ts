import {Routes} from "@angular/router/router";
import {AlertsRegistrationComponent} from "./alerts-registration/alerts-registration.component";
import {AlertsRegistrationStep2Component} from "./alerts-registration-step2/alerts-registration-step2.component";
import {AlertsRegistrationStep3Component} from "./alerts-registration-step3/alerts-registration-step3.component";
import {AuthGuardCompanyadminAlerts} from "../../auth-guard-companyadmin-alerts.service";


export const alertsRegistrationRoutes: Routes = [

    {
        path: '',
        component: AlertsRegistrationComponent,
        canLoad: [AuthGuardCompanyadminAlerts],

    },
    {
        path: 'registration2',
        component: AlertsRegistrationStep2Component,
        canLoad: [AuthGuardCompanyadminAlerts],

    },
    {
        path: 'registration3',
        component: AlertsRegistrationStep3Component,
        canLoad: [AuthGuardCompanyadminAlerts],

    },
]
