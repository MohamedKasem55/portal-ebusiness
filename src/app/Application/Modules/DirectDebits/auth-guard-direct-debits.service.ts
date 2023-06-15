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
export class AuthGuardDirectDebits
  implements CanActivate, CanActivateChild, CanLoad
{
  privilege = ['DIRECTDEBITS_PRIVILEGE', 'DIRECTDEBITS_LOCALBANK_PRIVILEGE']
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
      'DirectDebitMenu',
      ['DIRECTDEBITS_PRIVILEGE', 'DIRECTDEBITS_LOCALBANK_PRIVILEGE'],
      ['DirectDebitsGroup'],
    )
    if (this.checkTermsConditions(this.privilege[0])) {
      return this.redirectToTermsConditions(this.privilege[0], state)
    }
    if (this.checkTermsConditions(this.privilege[1])) {
      return this.redirectToTermsConditions(this.privilege[1], state)
    }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'DirectDebitMenu',
      ['DIRECTDEBITS_PRIVILEGE', 'DIRECTDEBITS_LOCALBANK_PRIVILEGE'],
      ['DirectDebitsGroup'],
    )
    return result
  }
}
