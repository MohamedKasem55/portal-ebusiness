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
import {AuthenticationService} from '../../../../../core/security/authentication.service'

@Injectable()
export class GovernmentRevenueTransferPaymentsGuard
    implements CanActivate, CanActivateChild, CanLoad {
    // todo revisar si neceasrio
    privilege = ['GOVERNMENTREVENUE_PRIVILEGE']

    constructor(
        private router: Router,
        private authentication: AuthenticationService,
    ) {
    }

    /**
     * @param privilege
     */
    checkTermsConditions(privilege) {
        const toc = this.authentication.mustSignTermsAndConditions(privilege)
        //
        return toc
    }

    /**
     * @param privilege
     * @param route
     */
    redirectToTermsConditions(privilege, route) {
        return this.router.createUrlTree(['/terms-and-conditions'], {
            queryParams: {
                privilege,
                url: route.url,
            },
        })
    }

    /**
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this.authentication.activateOption(
            'GovernmentRevenueMenu',
            ['GOVERNMENTREVENUE_PRIVILEGE'],
            ['GovRevenueGroup', 'GovRevenueBulkUploadGroup'],
        )
        // for (let i = this.privilege.length - 1; i >= 0; i--) {
        //   if(this.checkTermsConditions(this.privilege[i])) {
        //       return this.redirectToTermsConditions(this.privilege[i], state);
        //   }
        // }
        return result
    }

    /**
     *
     * @param route
     * @param state
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state)
    }

    /**
     *
     * @param route
     */
    canLoad(route: Route): boolean {
        const result = this.authentication.activateOption(
            'GovernmentRevenueMenu',
            ['GOVERNMENTREVENUE_PRIVILEGE'],
            ['GovRevenueGroup', 'GovRevenueBulkUploadGroup'],
        )
        return result
    }
}
