import { Component, OnInit } from '@angular/core'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  selector: 'app-payroll-management',
  templateUrl: './government-revenue-options.component.html',
})
export class GovernmentRevenueOptionsComponent implements OnInit {
  selectedAccount: any

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}
}
