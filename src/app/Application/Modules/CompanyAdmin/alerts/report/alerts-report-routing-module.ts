import {Routes} from "@angular/router/router";
import {ReportComponent} from "./report/report.component";
import {AuthGuardCompanyadminAlerts} from "../../auth-guard-companyadmin-alerts.service";

export const alertsReportsRoutes: Routes = [
    {
        path: '',
        component: ReportComponent,
        canLoad: [AuthGuardCompanyadminAlerts],

    }
]
