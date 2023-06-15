import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ZidDashboardService} from "./zid-dashboard.service";

@Injectable({ providedIn: 'root' })
export class ZidDashboardResolver implements Resolve<any> {
    constructor(
        private router: Router,
        private service: ZidDashboardService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {

    }
}