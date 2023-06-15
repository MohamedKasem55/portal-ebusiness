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
import { AuthenticationService } from '../../../core/security/authentication.service'

@Injectable()
export class VirtualAccountGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  privilege = [
    'VirtualAccounts',
    'VIRTUAL_ACCOUNTS_PRIVILEGE',
    'VirtualAccountsGroup',
  ]

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
      'VirtualAccountsMenu',
      ['VIRTUAL_ACCOUNTS_PRIVILEGE', ,],
      ['VirtualAccountsGroup'],
    )
    for (var i = this.privilege.length - 1; i >= 0; i--) {
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
      'VirtualAccountsMenu',
      ['VIRTUAL_ACCOUNTS_PRIVILEGE'],
      ['VirtualAccountsGroup'],
    )
    return result
  }
}
