import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-debit-card-change-pin-step3',
  templateUrl: './debit-card-change-pin-step3.component.html',
})
export class DebitCardChangePinStep3Component implements OnInit {
  otpTimer = 30
  reGenerateOTP: Subscription
  newOtp: number
  mensajeError: any = {}
  @ViewChild('authorization') authorization: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @Input() form: any
  validationResponse: any

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    if (this.requestValidate.otp) {
      this.requestValidate.otp = ''
    }
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }
}
