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
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable()
export class AuthGuardViewRequest
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (
      this.authenticationService.activateOption(
        'ChequeBookRequest',
        [],
        ['RequestCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequeInquiry',
        [],
        ['RequestCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequeStop',
        ['STOPCHECKBOOK_PRIVILEGE'],
        ['StopCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequePositivePayMenu',
        ['POSITIVEPAYCHECK_PRIVILEGE'],
        ['PositivePayCheckGroup'],
      )
    )
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    return (
      this.authenticationService.activateOption(
        'ChequeBookRequest',
        [],
        ['RequestCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequeInquiry',
        [],
        ['RequestCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequeStop',
        ['STOPCHECKBOOK_PRIVILEGE'],
        ['StopCheckBookGroup'],
      ) ||
      this.authenticationService.activateOption(
        'ChequePositivePayMenu',
        ['POSITIVEPAYCHECK_PRIVILEGE'],
        ['PositivePayCheckGroup'],
      )
    )
  }
}
