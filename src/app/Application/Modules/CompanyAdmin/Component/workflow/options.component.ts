import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Component({
  templateUrl: './options.component.html',
})
export class WorkflowOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}
  goNonAccounts() {
    this.router.navigate(['/companyadmin/workflow/nonAccountRules'])
  }

  goAccountRules() {
    this.router.navigate(['/companyadmin/workflow/accountRules'])
  }
  goEtrade() {
    this.router.navigate(['/companyadmin/workflow/eTrade'])
  }
}
