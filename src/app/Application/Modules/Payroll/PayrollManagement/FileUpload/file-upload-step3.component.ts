import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-file-upload-step3',
  templateUrl: './file-upload-step3.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep3Component {
  @Input() generateChallengeAndOTP: any
  @Input() confirmPaymentResponse: any
  @Input() type: any
  SalaryFileUpload = 'salary'
  EmployeeFileUpload = 'employee'

  isPending() {
    if (this.type == this.EmployeeFileUpload) {
      return false
    } else if (this.type == this.SalaryFileUpload) {
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
    return false
  }

  finish() {}
}
