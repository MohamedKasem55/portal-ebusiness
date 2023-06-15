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

@Injectable({
  providedIn: 'root',
})
export class PrepaidCardsGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}
  privilege = 'PREPAID_CARDS_PRIVILEGE'

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
    //const result=true;
    const result = this.authentication.activateOption(
      'PendingActionsPrepaidCards',
      ['PREPAID_CARDS_PRIVILEGE'],
      ['PrepaidCardsPaymentsGroup'],
    )
    // if (this.checkTermsConditions(this.privilege)) {
    //   return this.redirectToTermsConditions(this.privilege, state);
    // }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'PendingActionsPrepaidCards',
      ['PREPAID_CARDS_PRIVILEGE'],
      ['PrepaidCardsPaymentsGroup'],
    )
    return result
  }
}
