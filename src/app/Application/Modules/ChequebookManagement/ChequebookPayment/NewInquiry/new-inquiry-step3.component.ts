import { Component, Input, OnDestroy, OnInit } from '@angular/core'

import { TranslateService } from '@ngx-translate/core'
import { NewInquiryService } from './new-inquiry.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-new-inquiry-step3',
  templateUrl: './new-inquiry-step3.component.html',
})
export class NewInquiryStep3Component implements OnInit, OnDestroy {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(
    public translate: TranslateService,
    public service: NewInquiryService,
  ) {}

  ngOnInit() {
    // this.onInit.emit(this as Component);
  }

  ngOnDestroy() {}

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
