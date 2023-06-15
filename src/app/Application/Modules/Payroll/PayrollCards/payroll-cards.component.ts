import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'

@Component({
  selector: 'app-payroll-cards',
  templateUrl: './payroll-cards.component.html',
  styleUrls: ['./payroll-cards.component.scss'],
})
export class PayrollCardsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public sharedAcountData: SelectedDataService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
  }

  goCardInquiries() {
    this.router.navigate(['/payroll/payroll-cards/card-inquiries'])
  }

  goCardOperations() {
    this.router.navigate(['/payroll/payroll-cards/card-operations'])
  }

  goCardPayments() {
    this.router.navigate(['/payroll/payroll-cards/card-payments'])
  }

  goUploadFile() {
    this.router.navigate(['/payroll/payroll-cards/upload-file'])
  }

  goSentFile() {
    this.router.navigate(['/payroll/payroll-cards/view-sent-files'])
  }

  goFeedbackFiles() {
    this.router.navigate(['/payroll/payroll-cards/feedback-files'])
  }

  goDownloadTemplates() {
    this.router.navigate(['/payroll/payroll-cards/download-templates'])
  }

  goListReport() {
    this.router.navigate(['/payroll/payroll-cards/card-list-reports'])
  }

  goRequestStatus() {
    this.router.navigate(['/payroll/payroll-cards/request-status'])
  }
}
