import { Component } from '@angular/core'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  templateUrl: '../View/beneficiaries-options.component.html',
})
export class BeneficiariesOptions {
  constructor(public authenticationService: AuthenticationService) {}
}
