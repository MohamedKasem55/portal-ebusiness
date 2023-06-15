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
  selector: 'quick-international-transfer-step5',
  templateUrl:
    '../../View/international/home-quick-tranfer-international-step5.html',
})
export class QuickTransferStep5InternationalWidget
  implements OnInit, OnDestroy
{
  @Input() buttonLabel: string
  @Input() show: boolean
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge

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
