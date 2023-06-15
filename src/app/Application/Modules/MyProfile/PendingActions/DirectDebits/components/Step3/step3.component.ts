import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router) {}

  ngOnInit(): void {}

  finish() {
    this.router.navigate(['/myprofile/pending/direct-debits/step1'])
  }

  isPending() {
    if (this.sharedData.aproveFlow) {
      if (
        this.sharedData.authorizeValidate &&
        this.sharedData.authorizeValidate.generateChallengeAndOTP &&
        (this.sharedData.authorizeValidate.generateChallengeAndOTP
          .typeAuthentication === 'STATIC' ||
          this.sharedData.authorizeValidate.generateChallengeAndOTP
            .typeAuthentication === 'OTP' ||
          this.sharedData.authorizeValidate.generateChallengeAndOTP
            .typeAuthentication === 'CHALLENGE')
      ) {
        return false
      } else {
        return true
      }
    }

    return false
  }

  valid() {
    return true
  }
}
