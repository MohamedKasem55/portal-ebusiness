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
export class TransferGuard implements CanActivate, CanActivateChild, CanLoad {
  privilege = [
    'TRANSFER_PRIVILEGE_OWNACCOUNTS',
    'TRANSFER_PRIVILEGE_LOCALBANK',
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
    //console.log(route);
    return this.router.createUrlTree(['/terms-and-conditions'], {
      queryParams: {
        privilege,
        url: route.url,
      },
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = this.authentication.activateOption(
      'TransferMenu',
      [
        'TRANSFER_PRIVILEGE_OWNACCOUNTS',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_REMITTANCES',
      ],
      ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
    )
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.privilege.length; i++) {
      if (this.checkTermsConditions(this.privilege[i])) {
        return this.redirectToTermsConditions(this.privilege[i], state)
      }
    }
    return result
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): boolean {
    const result = this.authentication.activateOption(
      'TransferMenu',
      [
        'TRANSFER_PRIVILEGE_OWNACCOUNTS',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_LOCALBANK',
        'TRANSFER_PRIVILEGE_REMITTANCES',
      ],
      ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
    )
    return result
  }
}
