import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { StorageService } from '../storage/storage.service'
import { AuthenticationService } from './authentication.service'
import {QueryParamsManipulationService} from "../../Application/Components/common/services/query-params-manipulation.service";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly generalPrivilege = 'GENERAL_PRIVILEGE'
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authentication: AuthenticationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      const queryParams = QueryParamsManipulationService.parseQueryParams(document.documentURI)
      const queryParamsArr = QueryParamsManipulationService.parseQueryParamsArr(queryParams)
      const redirectTo = QueryParamsManipulationService.getQueryParam('redirectTo', queryParams)
      const redirected = QueryParamsManipulationService.getQueryParam('redirected', queryParams)

      if(redirectTo && !redirected){
        queryParamsArr.push('redirected=true')
        this.router.navigate(['/redirect'], {
          queryParams: QueryParamsManipulationService.transformParamArrToObj(queryParamsArr)
        })
        return
      }

      if (!this.authentication.userLogged()) {
        this.storageService.clearAll()
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        })
      }
      const needSign = this.authentication.mustSignTermsAndConditions(
        this.generalPrivilege,
      )
      if (needSign) {
        this.router.navigate(['/terms-and-conditions'], {
          queryParams: {
            privilege: this.generalPrivilege,
            url: state.url,
            isLogin: true,
          },
        })
      }
      const currentUser = this.authentication.getUser()
      if (
        !currentUser['user'].firstLogin &&
        !currentUser['user'].passwordExpired
      ) {
        return this.authentication.activateOption('Login', [], ['corporate'])
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
