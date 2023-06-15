import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-feedback-files-detail-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component {
  constructor(public router: Router) {}

  onFinish() {
    this.router.navigate(['/payments/billPayments/feedbackfiles'])
  }
}
