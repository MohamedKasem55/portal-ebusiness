import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './pos-statement-options.component.html',
})
export class PoSStatementOptionsComponent implements OnInit {
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goPoSStatementByTerminal() {
    this.router.navigate(['/accounts/posStatement'])
  }

  goOutstandingStatement() {
    this.router.navigate(['/posstatement/outstanding-statement'])
  }

  goPoSTerminal() {
    this.router.navigate(['/posstatement/pos-terminal'])
  }

  goPOSClaims() {
    this.router.navigate(['/posstatement/claims'])
  }
  goPOSDashboards() {
    this.router.navigate(['/posstatement/dashboard'])
  }

  goNewRequest() {
    this.router.navigate(['/posstatement/pos-request'])
  }

  goPOSManagementRequest() {
    this.router.navigate(['/posstatement/pos-manage-request'])
  }

  goPOSMaintenanceRequest() {
    this.router.navigate(['/posstatement/pos-maintenance-request'])
  }

  goPOSRequestStatus() {
    this.router.navigate(['/posstatement/request-status'])
  }

  goPOSCRMStatus() {
    this.router.navigate(['/posstatement/crm-status'])
  }

  transactionsPending() {
    //Se incluira if con llamada a servicio para verificar si tiene transacciones pendientes sino retornara false
    return true
  }
}
