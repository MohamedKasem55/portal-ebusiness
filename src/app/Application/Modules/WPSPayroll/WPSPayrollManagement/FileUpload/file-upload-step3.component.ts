import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-file-upload-step3',
  templateUrl: './file-upload-step3.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep3Component {
  @Input() fileSystemName: any
  @Input() generateChallengeAndOTP: any
  @Input() isEmployee: boolean

  isPending() {
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true && !this.isEmployee
    }
  }
}
