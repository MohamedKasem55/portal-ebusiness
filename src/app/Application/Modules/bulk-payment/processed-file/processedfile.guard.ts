import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable()
export class ProcessedfileGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authentication.activateOption(
      'BulkProcessedFiles',
      ['BULKPAYMENTS_PRIVILEGE'],
      ['BulkPaymentsGroup'],
    )
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authentication.activateOption(
      'BulkProcessedFiles',
      ['BULKPAYMENTS_PRIVILEGE'],
      ['BulkPaymentsGroup'],
    )
  }

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authentication.activateOption(
      'BulkProcessedFiles',
      ['BULKPAYMENTS_PRIVILEGE'],
      ['BulkPaymentsGroup'],
    )
  }
}
