import { Injectable } from '@angular/core'
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  Route,
  CanLoad,
} from '@angular/router'
import { AuthenticationService } from 'app/core/security/authentication.service'

@Injectable()
export class AuthGuardBlockReplCards
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const result = this.authentication.activateOption(
      'PrepaidCardsMenu',
      ['PREPAID_CARDS_PRIVILEGE'],
      ['PrepaidCardsClosureRequestReplacementGroup'],
    )
    return result
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'PrepaidCardsMenu',
      ['PREPAID_CARDS_PRIVILEGE'],
      ['PrepaidCardsClosureRequestReplacementGroup'],
    )
    return result
  }
}
