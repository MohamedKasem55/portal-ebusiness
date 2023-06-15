import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './direct-debits-options.component.html',
})
export class DirectDebitsOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goDashboard() {
    this.router.navigate(['/direct-debits/dashboard'])
  }

  goDirectDebitsManagePayer() {
    this.router.navigate(['/direct-debits/manage-payer'])
  }

  goUploadPayer() {
    this.router.navigate(['/direct-debits/payer-upload-file'])
  }

  goGenerateClaimFile() {
    this.router.navigate(['/direct-debits/manage-direct-debits'])
  }

  goUploadClaimFile() {
    this.router.navigate(['/direct-debits/direct-debit-upload-file'])
  }

  goProcessFile() {
    this.router.navigate(['/direct-debits/view-processed-files'])
  }

  goRequestStatus() {
    this.router.navigate(['/direct-debits/request-status'])
  }
}
