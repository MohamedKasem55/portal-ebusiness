import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate, Router,
    RouterStateSnapshot,
} from '@angular/router'
import {StorageService} from "../../../../../core/storage/storage.service";
import {QoyodDashboardService} from "./qoyod-dashboard.service";
import {Observable, of} from "rxjs";
import {map} from "rxjs/internal/operators/map";
import {catchError} from "rxjs/internal/operators/catchError";

@Injectable()
export class QoyodDashboardGard implements CanActivate {

    constructor(
        private router: Router,
        public storageService: StorageService,
        private service: QoyodDashboardService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        const authCode = route.queryParams.code

        return this.service.hasAccess().pipe(
            map(result => {

                if(result.errorCode == '0'){
                    route.data = {
                        ...route.data,
                        guardData: {
                            subscriptionExpiryNotice: result.renewSubscription,
                            activeSession: result.valid,
                            subscriptionStatus: result.subscriptionStatus
                        }
                    }

                    if (result.valid || authCode) {
                        return true;
                    } else {
                        this.router.navigateByUrl('/business-hub/qoyod/register',  {
                            state: { data: route.data }
                        })
                    }
                }


            }), catchError(err => {
                this.router.navigateByUrl('/')
                return of(false)
            })
        )

    }

}
