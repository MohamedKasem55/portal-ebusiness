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
  selector: 'app-ActivateCards-step3',
  templateUrl: './activateCards-step3.component.html',
  styleUrls: ['./activateCards.component.scss'],
})
export class ActivateCardsStep3Component implements OnInit {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Output() resetPin = new EventEmitter<Component>()

  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  goToReset() {
    this.resetPin.emit(this as Component)
  }

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
