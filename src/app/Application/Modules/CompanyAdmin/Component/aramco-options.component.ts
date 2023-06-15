import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  templateUrl: '../View/aramco-options.component.html',
})
export class AramcoOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goAddBeneficiary() {
    this.router.navigate(['/companyadmin/aramco/add-beneficiary'])
  }

  goBeneficiaryList() {
    this.router.navigate(['/companyadmin/aramco/beneficiaryList'])
  }
}
