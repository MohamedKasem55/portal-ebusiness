import { Component } from '@angular/core'
import { CardOperationsEntityService } from '../../card-opeartions-entity.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-cardOperations-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component {
  generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(private serviceData: CardOperationsEntityService) {}

  ngOnInit() {
    this.generateChallengeAndOTP =
      this.serviceData.getSelectedData().generateChallengeAndOTP
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
