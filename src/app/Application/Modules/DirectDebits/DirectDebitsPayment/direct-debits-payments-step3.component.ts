import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-direct-debits-payments-step3',
  templateUrl: './direct-debits-payments-step3.component.html',
  styleUrls: ['./direct-debits-payments.component.scss'],
})
export class DirectDebitsPaymentsStep3Component implements OnInit {
  @Input() fileSystemName: any
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
