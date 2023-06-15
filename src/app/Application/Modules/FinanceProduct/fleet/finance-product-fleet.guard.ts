import { AuthenticationService } from 'app/core/security/authentication.service'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
} from '@angular/router'
import {Injectable} from "@angular/core";

@Injectable()
export class FinanceProductFleetGuard
    implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private router: Router,
        private authentication: AuthenticationService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return undefined;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return undefined;
    }

    canLoad(route: Route):boolean {
        return undefined;
    }

}