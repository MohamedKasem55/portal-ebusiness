import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-view-sent-files',
  templateUrl: './view-sent-files.component.html',
  styleUrls: ['./view-sent-files.component.scss'],
})
export class ViewSentFilesComponent {
  radio: string

  constructor(private router: Router) {}

  selected() {
    switch (this.radio) {
      case 'uploadedFile': {
        this.router.navigate([
          '/payroll/payroll-cards/view-sent-files/view-uploaded-files',
        ])
        break
      }
      case 'cardPayments': {
        this.router.navigate([
          '/payroll/payroll-cards/view-sent-files/view-card-payments',
        ])
        break
      }
    }
  }
}
