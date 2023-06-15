import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../app/core/security/authentication.service'

@Component({
  templateUrl: './commercial-cards-management-options.component.html',
})
export class CommercialCardsManagementOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goViewQueryCards() {
    this.router.navigate(['/businessCards/creditcardlist'])
  }

  goActivateCards() {
    this.router.navigate(['/businessCards/activatecards'])
  }

  goSetResetPin() {
    this.router.navigate(['/businessCards/resetpin'])
  }

  goCardPayment() {
    this.router.navigate(['/businessCards/cardpayment'])
  }

  goBlockCard() {
    this.router.navigate(['/businessCards/blockcards'])
  }

  goBlockReplCard() {
    this.router.navigate(['/businessCards/blockReplaceCards'])
  }

  goRequestStatus() {
    this.router.navigate(['/businessCards/requeststatus'])
  }
}
