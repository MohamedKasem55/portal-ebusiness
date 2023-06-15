import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-request-reactivate-new-card-step3',
  templateUrl: './request-reactivate-step3.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateNewCardStep3Component implements OnInit {
  @Input() fileSystemName: any
  @Input() generateChallengeAndOTP: any
  @Input() option: any

  constructor() {}

  ngOnInit() {}

  isPending() {
    if (
      (this.generateChallengeAndOTP &&
        (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
          this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
          this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')) ||
      this.option === 'delete'
    ) {
      return false
    } else {
      return true
    }
  }
}
