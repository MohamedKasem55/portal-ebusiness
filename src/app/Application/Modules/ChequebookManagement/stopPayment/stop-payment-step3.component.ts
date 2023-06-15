import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import {
  FormBuilder,
  FormGroup,
} from '../../../../../../node_modules/@angular/forms'

@Component({
  selector: 'app-stop-payment-step3',
  templateUrl: 'stop-payment-step3.component.html',
})
export class StopPaymentStep3Component implements OnInit {
  @Input() form: FormGroup
  @Input() generateChallengeAndOTP: any

  constructor(private fb: FormBuilder, public translate: TranslateService) {}

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
