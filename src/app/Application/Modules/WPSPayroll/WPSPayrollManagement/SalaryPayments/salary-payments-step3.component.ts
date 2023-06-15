import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-salary-payments-step3',
  templateUrl: './salary-payments-step3.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsStep3Component implements OnInit {
  @Input() fileSystemName: any
  @Input() generateChallengeAndOTP: any
  @Input() confirmResponse: any

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
