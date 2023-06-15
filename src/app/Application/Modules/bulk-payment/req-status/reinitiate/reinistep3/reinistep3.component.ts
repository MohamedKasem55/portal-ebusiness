import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-reinistep3',
  templateUrl: './reinistep3.component.html',
  styleUrls: ['./reinistep3.component.scss'],
})
export class Reinistep3Component implements OnInit {
  @Input() generateChallengeAndOTP: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any

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
