import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PaymentsService } from './payments.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  authorizeSubscription: Subscription

  rejectReason: any

  constructor(
    public service: PaymentsService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  aproveFirstStep() {
    this.sharedData.aproveFlow = true
    this.router.navigate(['/myprofile/pending/aramco-payments/step2'])
  }

  rejectFirstStep() {
    this.rejectReason = null
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/aramco-payments/step2'])
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData.validate,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.validation = result
          this.cleanSelected()
          //console.log(this.sharedData.validation);
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/aramco-payments/step3'])
        } else {
          this.sharedData.validateResponse.generateChallengeAndOTP =
            result.generateChallengeAndOTP

          this.sharedData.requestValidate = new RequestValidate()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  confirmReject() {
    this.authorizeSubscription = this.service
      .refuseConfirm(this.sharedData.tableSelected, this.rejectReason)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.validation = result
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/aramco-payments/step3'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/aramco-payments/step' + this.wizardStep,
    ])
  }

  cleanSelected() {
    this.service.setSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.ARAMCO_PAYMENTS),
      PENDING_ACTION.ARAMCO_PAYMENTS,
    )
  }
}
