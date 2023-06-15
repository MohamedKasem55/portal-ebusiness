import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-moi-payment-step3',
  templateUrl: './moi-payment-step3.component.html',
})
export class MoiPaymentStep3Component {
  @Input() generateChallengeAndOTP: any
  @Input() confirmResponse

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

  hasBatchListsContainerSPProcessed() {
    return (
      this.confirmResponse &&
      this.confirmResponse.BatchListsContainerSPProcessed &&
      this.confirmResponse.BatchListsContainerSPProcessed.length > 0
    )
  }

  hasFileReference() {
    return (
      this.confirmResponse['fileReference'] &&
      this.confirmResponse['fileReference'] != null &&
      this.confirmResponse['fileReference'] != undefined &&
      this.confirmResponse['fileReference'] != ''
    )
  }
}
