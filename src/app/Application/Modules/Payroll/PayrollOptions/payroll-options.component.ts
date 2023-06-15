import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

import { SelectedDataService } from 'app/Application/Modules/Accounts/Services/selected-data-service'

@Component({
  templateUrl: './payroll-options.component.html',
})
export class PayrollOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public authenticationService: AuthenticationService,
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
  }

  goPayrollCards() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/payroll/payroll-cards'])
  }

  goPayrollManagement() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/payroll/payroll-management'])
  }

  goWPSPayroll() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-management'])
  }
}
