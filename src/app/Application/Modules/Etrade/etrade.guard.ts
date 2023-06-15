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
export class EtradeGuard
  implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = this.authentication.activateOption(
      'EtradeMenu',
      ['ETRADE_PRIVILEGE'],
      ['eTradeGroup'],
    )
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'EtradeMenu',
      ['ETRADE_PRIVILEGE'],
      ['eTradeGroup'],
    )
    return result
  }
}
