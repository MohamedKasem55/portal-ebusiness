import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class MoiPaymentsGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  privilege = 'EGOVERNMENT_PRIVILEGE'
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  checkTermsConditions(privilege) {
    const toc = this.authentication.mustSignTermsAndConditions(privilege)

    return toc
  }

  redirectToTermsConditions(privilege, route) {
    return this.router.createUrlTree(['/terms-and-conditions'], {
      queryParams: {
        privilege,
        url: route.url,
      },
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = this.authentication.activateOption(
      'PendingActionMOI',
      ['EGOVERNMENT_PRIVILEGE'],
      ['EgovGroup'],
    )
    if (this.checkTermsConditions(this.privilege)) {
      return this.redirectToTermsConditions(this.privilege, state)
    }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'PendingActionMOI',
      ['EGOVERNMENT_PRIVILEGE'],
      ['EgovGroup'],
    )
    return result
  }
}
