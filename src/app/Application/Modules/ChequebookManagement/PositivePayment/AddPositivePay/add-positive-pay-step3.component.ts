import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-positive-step3',
  templateUrl: './add-positive-pay-step3.component.html',
})
export class AddPositivePayStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any

  @Input() positivePayResult: any

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
