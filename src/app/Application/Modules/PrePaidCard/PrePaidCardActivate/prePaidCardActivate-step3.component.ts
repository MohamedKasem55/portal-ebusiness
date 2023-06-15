import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
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

@Component({
  selector: 'app-step3',
  templateUrl: './prePaidCardActivate-step3.component.html',
})
export class PrePaidCardActivateStep3Component implements OnInit {
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
