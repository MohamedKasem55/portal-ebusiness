import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-request-reactivate-management-step3',
  templateUrl: './request-reactivate-step3.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any
  @Input() option: any
  @Input() DeleteOption: any

  constructor() {}

  ngOnInit() {}

  isPending() {
    if (this.option === this.DeleteOption) {
      return false
    }
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
