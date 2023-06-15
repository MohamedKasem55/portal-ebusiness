import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { BeneficiariesService } from './beneficiaries.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'

@Component({
  templateUrl: './beneficiaries.component.html',
})
export class BeneficiariesComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  authorizeSubscription: Subscription

  constructor(
    public service: BeneficiariesService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {}

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/aramco-beneficiaries/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.aproveFlow = true
    this.router.navigate(['/myprofile/pending/aramco-beneficiaries/step2'])
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/aramco-beneficiaries/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/aramco-beneficiaries/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirmMultiple(
        this.sharedData.authorizeValidateMultiple.batchListAlrajhi,
        this.sharedData.authorizeValidateMultiple.batchListLocal,
        this.sharedData.authorizeValidateMultiple.batchListInternational,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        this.authorizeSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.responseMultipleAuthorizeConfirm = result
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate([
            '/myprofile/pending/aramco-beneficiaries/step3',
          ])
        }
      })
  }

  confirmReject() {
    this.authorizeSubscription = this.service
      .refuseConfirmMultiple(
        this.sharedData.withinSelected,
        this.sharedData.localSelected,
        this.sharedData.internationalSelected,
      )
      .subscribe((result) => {
        this.authorizeSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.responseMultipleAuthorizeConfirm = result
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate([
            '/myprofile/pending/aramco-beneficiaries/step3',
          ])
        }
      })
  }
}
