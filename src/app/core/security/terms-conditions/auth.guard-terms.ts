import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { StorageService } from '../../storage/storage.service'
import { AuthenticationService } from '../authentication.service'

@Injectable()
export class AuthGuardTerms implements CanActivate {
  constructor(
    private router: Router,
    public storageService: StorageService,
    private authentication: AuthenticationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      const currentUser = JSON.parse(
        this.storageService.retrieve('currentUser'),
      )
      if (state.url.startsWith('/terms-conditions')) {
        return !currentUser
      }
      if (state.url.startsWith('/change-password')) {
        return (
          (currentUser &&
            (currentUser['user'].passwordExpired ||
              currentUser['user'].firstLogin)) ||
          !currentUser['user'].hasChallengeQuestions
        )
      }
    } catch (err) {
      this.storageService.clearAll()
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      })
    }
    return false
  }
}
