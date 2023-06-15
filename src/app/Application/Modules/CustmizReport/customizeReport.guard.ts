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
export class CustomizeReportGuard
  implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticationService.activateOption(
      'PosStatementMenu',
      ['CUSTOMIZE_REPORT_PRIVILEGE'],
      ['CustomizeReportGroup'],
    )
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    return this.authenticationService.activateOption(
      'PosStatementMenu',
      ['CUSTOMIZE_REPORT_PRIVILEGE'],
      ['CustomizeReportGroup'],
    )
  }
}
