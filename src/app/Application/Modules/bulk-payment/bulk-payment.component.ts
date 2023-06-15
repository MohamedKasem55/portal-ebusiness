import { Component } from '@angular/core'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: 'bulk-payment.component.html',
})
export class BulkPaymentComponent {
  constructor(public authenticationService: AuthenticationService) {}
}
