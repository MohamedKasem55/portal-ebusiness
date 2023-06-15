import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-bill-request-reactivate-step3',
  templateUrl: './request-reactivate-step3.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any

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
