import { Component } from '@angular/core'

@Component({
  selector: 'app-card-payments-add',
  templateUrl: './card-payments-add.component.html',
  styleUrls: ['./card-payments.component.scss'],
})
export class AddCardPaymentsComponent {
  step: number

  constructor() {
    this.step = 1
  }

  next() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }
}
