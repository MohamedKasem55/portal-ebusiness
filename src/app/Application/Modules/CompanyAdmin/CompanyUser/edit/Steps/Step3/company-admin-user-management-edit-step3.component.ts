import { Component, Input, OnInit } from '@angular/core'
import { StorageService } from '../../../../../../../core/storage/storage.service'

@Component({
  selector: 'company-admin-user-management-edit-step3',
  templateUrl: './company-admin-user-management-edit-step3.component.html',
})
export class CompanyAdminUserManagementEditStep3Component implements OnInit {
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
