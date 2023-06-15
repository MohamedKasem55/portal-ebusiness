import {Injectable} from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
} from '@angular/router'
import {AuthenticationService} from '../../../core/security/authentication.service'

@Injectable()
export class RequestToPayGuard
    implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private router: Router,
        private authentication: AuthenticationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authentication.activateOption(
            'RTPService',
            ['TRANSFER_PRIVILEGE_LOCALBANK'],
            ['rtpGroup','CompanyAdmins'],
        )
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state)
    }

    canLoad(route: Route): boolean {
        return this.authentication.activateOption(
            'RTPService',
            ['TRANSFER_PRIVILEGE_LOCALBANK'],
            ['rtpGroup','CompanyAdmins'],
        )
    }
}