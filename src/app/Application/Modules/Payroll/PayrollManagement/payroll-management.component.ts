import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'

@Component({
  selector: 'app-payroll-management',
  templateUrl: './payroll-management.component.html',
  styleUrls: ['./payroll-management.component.scss'],
})
export class PayrollManagementComponent implements OnInit {
  selectedAccount: any

  constructor(
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
  }

  goManageEmployees() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/payroll/payroll-management/manage-employees'])
  }

  goUploadFile() {
    this.router.navigate(['/payroll/payroll-management/employee-upload-file'])
  }

  goSalaryPayments() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/payroll/payroll-management/salary-payments'])
  }

  goSalaryPaymentUploadFile() {
    this.router.navigate([
      '/payroll/payroll-management/salary-payment-upload-file',
    ])
  }

  goProcessedFiles() {
    this.router.navigate(['/payroll/payroll-management/view-processed-files'])
  }

  goRequestStatus() {
    this.router.navigate(['/payroll/payroll-management/request-status'])
  }

  goDownloadTemplates() {
    this.router.navigate(['/payroll/payroll-management/download-templates'])
  }

  goDashboard() {
    this.router.navigate(['/payroll/payroll-management/dashboard'])
  }
}
