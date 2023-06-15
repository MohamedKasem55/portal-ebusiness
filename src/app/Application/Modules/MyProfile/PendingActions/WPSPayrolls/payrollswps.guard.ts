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
export class PayrollswpsGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  privilege = ['WPSPAYROLL_PRIVILEGE', 'WMSPAYROLL_PRIVILEGE']
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
      'PendingActionWPSPayroll',
      ['WPSPAYROLL_PRIVILEGE', 'WMSPAYROLL_PRIVILEGE'],
      ['WPSPayrollGroup', 'WMSPayrollGroup'],
    )
    for (let i = this.privilege.length - 1; i >= 0; i--) {
      if (this.checkTermsConditions(this.privilege[i])) {
        return this.redirectToTermsConditions(this.privilege[i], state)
      }
    }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'PendingActionWPSPayroll',
      ['WPSPAYROLL_PRIVILEGE', 'WMSPAYROLL_PRIVILEGE'],
      ['WPSPayrollGroup', 'WMSPayrollGroup'],
    )
    return result
  }
}
