import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'

@Component({
  selector: 'app-payroll-management',
  templateUrl: './wpspayroll-management.component.html',
  styleUrls: ['./wpspayroll-management.component.scss'],
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

  goDashboard() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-management/dashboard'])
  }

  goManageEmployees() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-management/manage-employees'])
  }

  goUploadFile() {
    this.router.navigate([
      '/wpspayroll/wpspayroll-management/employee-upload-file',
    ])
  }

  goSalaryPayments() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-management/salary-payments'])
  }

  goSalaryPaymentUploadFile() {
    this.router.navigate([
      '/wpspayroll/wpspayroll-management/salary-payment-upload-file',
    ])
  }

  goProcessedFiles() {
    this.router.navigate([
      '/wpspayroll/wpspayroll-management/view-processed-files',
    ])
  }

  goRequestStatus() {
    this.router.navigate(['/wpspayroll/wpspayroll-management/request-status'])
  }

  goDownloadMol() {
    this.router.navigate(['/wpspayroll/wpspayroll-management/download-mol'])
  }

  goDownloadTemplates() {
    this.router.navigate([
      '/wpspayroll/wpspayroll-management/download-templates',
    ])
  }
}
