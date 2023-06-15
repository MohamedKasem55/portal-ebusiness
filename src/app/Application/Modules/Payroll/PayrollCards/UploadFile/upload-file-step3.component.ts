import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-upload-file-step3',
  templateUrl: './upload-file-step3.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileStep3Component {
  @Input() generateChallengeAndOTP: any

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
