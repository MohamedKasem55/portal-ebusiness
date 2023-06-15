import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-file-upload-step3',
  templateUrl: './file-upload-step3.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep3Component {
  @Input() generateChallengeAndOTP: any
  @Input() confirmPaymentResponse: any
}
