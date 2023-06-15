import { Component, OnInit, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-update-cards-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() option: any
  @Input() DeleteOption: any
  @Input() batch: any

  constructor() {}

  ngOnInit() {}

  isPending() {
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else if (this.option == this.DeleteOption) {
      return false
    } else {
      return true
    }
  }
}
