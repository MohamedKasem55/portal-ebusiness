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
export class ChequebookGuard implements CanActivate, CanActivateChild, CanLoad {
  privilege = ''
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  checkTermsConditions(privilege) {
    const toc = this.authenticationService.mustSignTermsAndConditions(privilege)

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
    const result =
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
    /* if(this.checkTermsConditions(this.privilege))
            return this.redirectToTermsConditions(this.privilege, state);*/
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result =
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
    return result
  }
}
