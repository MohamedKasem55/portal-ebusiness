import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable()
export class AuthGuardGovRevenue
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.authentication.activateOption(
      'GovernmentRevenueAdmin',
      ['GOVERNMENTREVENUE_PRIVILEGE'],
      ['GovRevenueGroupAdmin'],
    )
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(next, state)
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.authentication.activateOption(
      'GovernmentRevenueAdmin',
      ['GOVERNMENTREVENUE_PRIVILEGE'],
      ['GovRevenueGroupAdmin'],
    )
  }
}
