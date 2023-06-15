import { Component, Input } from '@angular/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-add-request-step3',
  templateUrl: './add-request-step3.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestStep3Component {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge

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
