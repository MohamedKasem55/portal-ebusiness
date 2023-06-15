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
import { AuthenticationService } from 'app/core/security/authentication.service'

@Injectable()
export class FinanceProductNewRequestGuard
  implements CanActivate, CanActivateChild, CanLoad {
  privilege = 'PRODUCT_FINANCE_PRIVILEGE'

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authentication.activateOption(
      'POSFinanceProduct',
      [],
      ['CompanyAdmins'],
    )
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    return this.authentication.activateOption(
      'POSFinanceProduct',
      [],
      ['CompanyAdmins'],
    )
  }
}
