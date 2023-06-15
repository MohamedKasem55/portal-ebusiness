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
export class URPayGuard
  implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authentication.activateOption(
      'AdminManagement',
      [],
      ['CompanyAdmins'],
    )
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    return this.authentication.activateOption(
      'AdminManagement',
      [],
      ['CompanyAdmins'],
    )
  }
}
