import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-upload-file-step3',
  templateUrl: './upload-file-step3.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep3Component implements OnInit {
  @Output() onInit = new EventEmitter<any>()
  step: number
  generateChallengeAndOTP: any

  constructor() {
    this.step = 3
  }

  ngOnInit() {
    this.onInit.emit(this)
  }

  isPending() {
    //console.log(this.initPayment);
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
