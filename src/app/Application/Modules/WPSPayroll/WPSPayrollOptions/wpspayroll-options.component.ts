import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SelectedDataService } from 'app/Application/Modules/Accounts/Services/selected-data-service'

@Component({
  templateUrl: './wpspayroll-options.component.html',
})
export class WPSPayrollOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
  }

  goPayrollCards() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-card'])
  }

  goPayrollManagement() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wpspayroll/wpspayroll-management'])
  }
}
