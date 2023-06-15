import {Routes} from "@angular/router/router";
import {AuthGuardCompanyadminAlerts} from "../auth-guard-companyadmin-alerts.service";
import {AlertsComponent} from "./alerts.component";

export const alertsRoutes: Routes = [
    {
        path: '',
        canLoad: [AuthGuardCompanyadminAlerts],
        component: AlertsComponent,
    },
    {
        path: 'registration',
        loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
    },
    {
        path: 'renewal',
        loadChildren: () => import('./renewal/renewal.module').then((m) => m.RenewalModule),

    },
    {
        path: 'report',
        loadChildren: () => import('./report/report.module').then((m) => m.ReportModule)
    },
    {
        path: 'desactivate',
        loadChildren: () => import('./de-activate/de-activate.module').then((m) => m.DeActivateModule),
    }
]
