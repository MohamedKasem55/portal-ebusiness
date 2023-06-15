import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'

@Component({
  templateUrl: './wmspayroll-options.component.html',
})
export class WMSPayrollOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
  }

  //Pendiente de crear
  // goPayrollCards(){
  // 	this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount);
  // 	this.router.navigate(['/wmspayroll/wmspayroll-card']);
  // }

  goPayrollManagement() {
    this.sharedAcountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate(['/wmspayroll/wmspayroll-management'])
  }
}
