import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-block-card-step3',
  templateUrl: './blockCards-step3.component.html',
  styleUrls: ['./blockCards.component.scss'],
})
export class BlockCardsStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any

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
