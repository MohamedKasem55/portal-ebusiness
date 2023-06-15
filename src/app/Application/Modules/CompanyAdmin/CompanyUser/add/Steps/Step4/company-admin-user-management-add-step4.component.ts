import { Component, Input, OnInit } from '@angular/core'
import { StorageService } from '../../../../../../../core/storage/storage.service'

@Component({
  selector: 'company-admin-user-management-add-step4',
  templateUrl: './company-admin-user-management-add-step4.component.html',
})
export class CompanyAdminUserManagementAddStep4Component implements OnInit {
  @Input() generateChallengeAndOTP: any
  dualAuthorization = false

  constructor(public storage: StorageService) {
    this.dualAuthorization = JSON.parse(storage.retrieve('currentUser'))[
      'company'
    ]['dualAuthorization']
  }
  ngOnInit() {}

  isPending() {
    if (!this.dualAuthorization) {
      return false
    } else {
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
}
