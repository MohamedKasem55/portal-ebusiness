import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-step3',
  templateUrl: './chequebook-payment-step3.component.html',
  styleUrls: ['./chequebook-payment.component.scss'],
})
export class ChequebookPaymentStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any

  constructor() {}

  ngOnInit() {}

  isPending() {
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }
}
