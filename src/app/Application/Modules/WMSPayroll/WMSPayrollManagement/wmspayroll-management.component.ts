import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'

@Component({
  selector: 'app-payroll-management',
  templateUrl: './wmspayroll-management.component.html',
})
export class PayrollManagementComponent implements OnInit {
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

  goProcessedFiles() {
    this.router.navigate([
      '/wmspayroll/wmspayroll-management/view-processed-files',
    ])
  }

  goSalaryPaymentUploadFile() {
    this.router.navigate([
      '/wmspayroll/wmspayroll-management/salary-payment-upload-file',
    ])
  }

  goRequestStatus() {
    this.router.navigate(['/wmspayroll/wmspayroll-management/request-status'])
  }

  goDownloadMol() {
    this.router.navigate(['/wmspayroll/wmspayroll-management/download-mol'])
  }
}
