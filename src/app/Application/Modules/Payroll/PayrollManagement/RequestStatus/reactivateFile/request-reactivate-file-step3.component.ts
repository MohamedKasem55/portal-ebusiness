import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-request-reactivate-file-step3',
  templateUrl: './request-reactivate-file-step3.component.html',
  styleUrls: ['./request-reactivate-file.component.scss'],
})
export class RequestReactivateFileStep3Component implements OnInit {
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
