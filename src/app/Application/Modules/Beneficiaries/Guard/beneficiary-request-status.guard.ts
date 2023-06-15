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
export class BeneficiaryRequestStatusGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  privilege = [
    'TRANSFER_PRIVILEGE_OWNACCOUNTS',
    'TRANSFER_PRIVILEGE',
    'TRANSFER_PRIVILEGE_LOCALBANK',
    'TRANSFER_PRIVILEGE_REMITTANCES',
  ]
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
  ) {}

  checkTermsConditions(privilege) {
    const toc = this.authentication.mustSignTermsAndConditions(privilege)

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
    const result = this.authentication.activateOption(
      'BeneficiaryRequestStatus',
      [
        'TRANSFER_PRIVILEGE_OWNACCOUNTS',
        'TRANSFER_PRIVILEGE',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_REMITTANCES',
      ],
      ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
    )
    if (this.checkTermsConditions(this.privilege[0])) {
      return this.redirectToTermsConditions(this.privilege[0], state)
    }
    if (this.checkTermsConditions(this.privilege[1])) {
      return this.redirectToTermsConditions(this.privilege[1], state)
    }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'BeneficiaryRequestStatus',
      [
        'TRANSFER_PRIVILEGE_OWNACCOUNTS',
        'TRANSFER_PRIVILEGE',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_REMITTANCES',
      ],
      ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
    )
    return result
  }
}
