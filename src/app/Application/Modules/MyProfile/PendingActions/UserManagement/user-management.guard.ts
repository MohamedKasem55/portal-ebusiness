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

@Injectable({
  providedIn: 'root',
})
export class UserManagementGuard
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
    return this.authentication.activateOption(
      'PendingActionUsersAdd',
      [],
      ['CompanyAdmins'],
    )
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(route, state)
  }
  canLoad(route: Route): boolean {
    return this.authentication.activateOption(
      'PendingActionUsersAdd',
      [],
      ['CompanyAdmins'],
    )
  }
}
