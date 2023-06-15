import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from '../../../../../../core/storage/storage.service'

@Component({
  selector: 'app-etrade-step3',
  templateUrl: './etrade-step3.component.html',
})
export class EtradeStep3Component implements OnInit {
  generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(public router: Router, private storageService: StorageService) {}

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
      if (this.storageService.retrieve('currentuser') !== undefined) {
        return JSON.parse(this.storageService.retrieve('currentuser'))[
          'company'
        ]['dualAuthorization']
      }
      return true
    }
  }
}
