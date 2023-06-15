import { Component, Input } from '@angular/core'

@Component({
  selector: 'within-step3-component',
  templateUrl: 'within-step3-component.html',
})
export class WithinStep3Component {
  @Input()
  currentAction: string
  @Input()
  validateResponse: any

  isPending() {
    if (
      this.validateResponse.generateChallengeAndOTP &&
      (this.validateResponse.generateChallengeAndOTP.typeAuthentication ===
        'STATIC' ||
        this.validateResponse.generateChallengeAndOTP.typeAuthentication ===
          'OTP' ||
        this.validateResponse.generateChallengeAndOTP.typeAuthentication ===
          'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }
}
