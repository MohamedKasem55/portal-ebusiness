import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-request-reactivate-stop-step3',
  templateUrl: './request-reactivate-stop-step3.component.html',
})
export class RequestReactivateStopStep3Component implements OnInit {
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
