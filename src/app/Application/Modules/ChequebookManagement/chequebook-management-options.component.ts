import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './chequebook-management-options.component.html',
})
export class ChequebookManagementOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goViewRequest() {
    this.router.navigate(['/accounts/chequebook/view-request'])
  }

  goCreateCheckebook() {
    this.router.navigate(['/accounts/chequeBookStep1'])
  }

  goStopChequebook() {
    this.router.navigate(['/accounts/chequebook/stop-chequebook'])
  }

  goChequebookInquiry() {
    this.router.navigate(['/accounts/chequebook/chequebook-payment'])
  }

  goPositivePayChequebook() {
    this.router.navigate(['/accounts/chequebook/positive-payment'])
  }

  goRequestStatus() {
    this.router.navigate(['/accounts/chequebook/request-status'])
  }

  goReports() {
    this.router.navigate(['/accounts/chequebook/reports'])
  }
}
