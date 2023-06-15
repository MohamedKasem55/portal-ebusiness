import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable({
  providedIn: 'root',
})
export class DividedDistributionsRequestReportGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authenticationService.activateOption(
      'DividendDistributionPeriods',
      ['DIVIDEND_DISTRIBUTION_PRIVILEGE'],
      ['DividendDistribGroup'],
    )
  }
}
