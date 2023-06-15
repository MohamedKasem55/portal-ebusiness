import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent {
  radio: string

  constructor(private router: Router) {}
  selected() {
    switch (this.radio) {
      case 'cardOperations': {
        this.router.navigate([
          '/payroll/payroll-cards/request-status/card-operation',
        ])
        break
      }
      case 'payments': {
        this.router.navigate([
          '/payroll/payroll-cards/request-status/card-payments',
        ])
        break
      }
      case 'uploadFile': {
        this.router.navigate([
          '/payroll/payroll-cards/request-status/upload-files',
        ])
        break
      }
      case 'requestNewCardOnline': {
        this.router.navigate([
          '/payroll/payroll-cards/request-status/request-new-card-online',
        ])
        break
      }
    }
  }
}
