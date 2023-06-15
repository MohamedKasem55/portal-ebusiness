import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-CardPayment-step3',
  templateUrl: './cardPayment-step3.component.html',
})
export class CardPaymentStep3Component implements OnInit {
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
