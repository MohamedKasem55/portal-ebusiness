import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-reset-card-pin-step3',
  templateUrl: './resetPIN-step3.component.html',
  styleUrls: ['./resetPIN.component.scss'],
})
export class ResetPINStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(public translate: TranslateService) {}

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
