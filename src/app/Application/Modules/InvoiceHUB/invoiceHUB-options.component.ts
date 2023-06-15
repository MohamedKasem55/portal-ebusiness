import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './invoiceHUB-options.component.html',
})
export class InvoiceHUBOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goPaySingleInvoice() {
    this.router.navigate(['/invoiceHUB/single-payment'])
  }

  goPayMultipleInvoice() {
    this.router.navigate(['/invoiceHUB/multi-payment'])
  }

  goRequestStatus() {
    this.router.navigate(['/invoiceHUB/request-status'])
  }

  goFeedBackFiles() {
    this.router.navigate(['/invoiceHUB/feedback-files'])
  }

  goInvoiceHistory() {
    this.router.navigate(['/invoiceHUB/invoice-history'])
  }

  goReconciliation() {
    this.router.navigate(['invoiceHUB/reconciliation'])
  }

  goProcessedTransactions() {
    this.router.navigate(['invoiceHUB/processedTransactions'])
  }

  goReports() {
    this.router.navigate(['/invoiceHUB/monthlyStatistics'])
  }
}
