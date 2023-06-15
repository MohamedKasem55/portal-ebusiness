import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate, Router,
    RouterStateSnapshot,
} from '@angular/router'
import {StorageService} from "../../../../../core/storage/storage.service";
import {Observable, of} from "rxjs";
import {ZidDashboardService} from "./zid-dashboard.service";

@Injectable()
export class ZidDashboardGard implements CanActivate {
    constructor(
        private router: Router,
        private service: ZidDashboardService,
        public storageService: StorageService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        return this.router.navigateByUrl('/business-hub/zid/register')
    }

}
