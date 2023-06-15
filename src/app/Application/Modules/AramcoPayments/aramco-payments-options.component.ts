import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './aramco-payments-options.component.html',
})
export class AramcoPaymentsOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goAddBeneficiary() {
    this.router.navigate(['/aramcoPayments/add-beneficiary'])
  }

  goBeneficiaryList() {
    this.router.navigate(['/aramcoPayments/beneficiaries'])
  }

  goRequestStatus() {
    this.router.navigate(['/aramcoPayments/request-status'])
  }

  goNewPayment() {
    this.router.navigate(['/aramcoPayments/beneficiaries/payment'])
  }
}
