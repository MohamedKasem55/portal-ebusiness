import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot
} from "@angular/router";
import {config, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {QoyodDashboardService} from "./qoyod-dashboard.service";
import {map} from "rxjs/internal/operators/map";

@Injectable({ providedIn: 'root' })
export class QoyodDashboardResolver implements Resolve<any> {

    constructor(
        private router: Router,
        private service: QoyodDashboardService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {

        const guardData = route.data.guardData

        if(!guardData.activeSession){
            const loginData = {
                code: route.queryParams.code,
                systemId: this.service.SYS_ID
            }

             return this.service.login(loginData).pipe(
                 map(result => {
                    this.router.navigateByUrl('/business-hub/qoyod/dashboard')
                })
            )
        }

    }
}