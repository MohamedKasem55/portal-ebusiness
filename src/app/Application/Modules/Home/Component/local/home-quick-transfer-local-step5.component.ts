import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'quick-local-transfer-step5',
  templateUrl: '../../View/local/home-quick-tranfer-local-step5.html',
})
export class QuickTransferStep5LocalWidget implements OnInit, OnDestroy {
  @Input() buttonLabel: string
  @Input() show: boolean
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  ngOnInit() {
    //console.log('emit init 5');
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}

  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    this.onNext.emit(true)
    //console.log('submit 5');
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
