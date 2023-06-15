import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-step3',
  templateUrl: './create-chequebook-step3.component.html',
  styleUrls: ['./create-chequebook.component.scss'],
})
export class CreateChequebookStep3Component implements OnInit {
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
