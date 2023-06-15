import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-add-claim-step3',
  templateUrl: './add-claim-step3.component.html',
  styleUrls: ['./add-claim.component.scss'],
})
export class AddClaimStep3Component {
  @Input() generateChallengeAndOTP: any
  @Input() tickets: any

  getTickets() {
    let cadTickets = ''
    if (this.tickets && this.tickets.length > 0) {
      cadTickets = this.tickets[0]
      for (let i = 1; i < this.tickets.length; ++i) {
        cadTickets = cadTickets + ', ' + this.tickets[i]
      }
    }
    return cadTickets
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
