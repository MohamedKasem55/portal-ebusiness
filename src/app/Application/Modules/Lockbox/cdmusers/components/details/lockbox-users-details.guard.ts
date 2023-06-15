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
import { AuthenticationService } from '../../../../../../core/security/authentication.service'

@Injectable()
export class LockboxUsersDetailsGuard
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
      'LockBoxUsers',
      ['LOCKBOX_PRIVILEGE'],
      ['LockboxGroupAdmin'],
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
      'LockBoxUsers',
      ['LOCKBOX_PRIVILEGE'],
      ['LockboxGroupAdmin'],
    )
    return result
  }
}
