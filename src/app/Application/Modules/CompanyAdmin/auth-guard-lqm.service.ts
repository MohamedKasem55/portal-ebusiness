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
export class AuthGuardLQM implements CanActivate, CanActivateChild, CanLoad {
  privilege = ''
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  checkTermsConditions(privilege) {
    const toc = this.authentication.mustSignTermsAndConditions(privilege)
    //console.log(privilege, toc);
    return toc
  }

  redirectToTermsConditions(privilege, route) {
    //console.log(route);
    return this.router.createUrlTree(['/terms-and-conditions'], {
      queryParams: {
        privilege,
        url: route.url,
      },
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = this.authentication.activateOption(
      'LiquidityManagementAdmin',
      ['CASH_MANAGEMENT_PRIVILEGE'],
      ['LiquidityManagement'],
    )
    /*if(this.checkTermsConditions(this.privilege))
            return this.redirectToTermsConditions(this.privilege, state);*/
    return result
    //return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'LiquidityManagementAdmin',
      ['CASH_MANAGEMENT_PRIVILEGE'],
      ['LiquidityManagement'],
    )
    return result
    //return true;
  }
}
