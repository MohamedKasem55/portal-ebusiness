import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'

// Import necesarios para trabajar con un modelo de datos compartido.
import { FormDataService } from '../Services/shared-form-data.service'
import { PendingActionsNotificaterService } from '../../Common/Components/PendingActions/pending-actions-notificater.service'

//import { FormData } from "../../Model/shared-form-Data.model";

@Component({
  templateUrl: '../View/add-beneficiary-last-step.component.html',
})
export class AddBeneficiaryLastStep implements OnInit {
  @Input() formData: FormData

  pending: boolean
  sharedData: any

  constructor(
    public formDataService: FormDataService,
    public pendingActionNotification: PendingActionsNotificaterService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.sharedData = this.formDataService.getSharedData()
    this.pending = true
    if (
      this.sharedData.generateChallengeAndOTP &&
      ['STATIC', 'OTP', 'CHALLENGE'].indexOf(
        this.sharedData.generateChallengeAndOTP.typeAuthentication,
      ) > -1
    ) {
      this.pending = false
    }
  }

  lastWizardStep() {
    const back = this.sharedData['back'] == 'transfer'
    const backType = this.sharedData['backType']
    this.formDataService.deleteData()
    this.pendingActionNotification.getRefreshObserver().next(true)
    if (back) {
      if (backType == 'ALRAJHI') {
        this.router.navigate([
          '/transfers/transfers',
          { type: 'rajhiTransfer' },
        ])
      } else if (backType == 'INTERNATIONAL') {
        this.router.navigate([
          '/transfers/transfers',
          { type: 'internationalTransfer' },
        ])
      } else if (backType == 'LOCAL') {
        this.router.navigate([
          '/transfers/transfers',
          { type: 'localTransfer' },
        ])
      } else {
        this.router.navigate(['/beneficiaries/AddBeneficiaries'])
      }
    } else {
      this.router.navigate(['/beneficiaries/AddBeneficiaries'])
    }
  }
}
