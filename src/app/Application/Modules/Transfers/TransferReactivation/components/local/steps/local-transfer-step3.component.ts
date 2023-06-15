import { Component, Input } from '@angular/core'

@Component({
  selector: 'local-transfer-step3-component',
  templateUrl: 'local-transfer-step3-component.html',
})
export class LocalTransferStep3Component {
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
