import { Component, Input } from '@angular/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-gov-revenue-payment-step3',
  templateUrl: './wizard-step-3.component.html',
})
export class WizardStep3Component {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() checkPending = true
  @Input() confirmResponse: any = {}
  @Input() govRevenueAccountsList: any
  @Input() formModel: any
 
  isPending() {
    if (
      this.checkPending &&
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
