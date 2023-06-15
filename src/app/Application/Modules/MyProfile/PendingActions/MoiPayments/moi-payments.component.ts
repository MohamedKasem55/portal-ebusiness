import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MoiPaymentsService } from './moi-payments.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './moi-payments.component.html',
})
export class MoiPaymentsComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  authorizeSubscription: Subscription
  rejectReason = ''
  currentComponent: any

  constructor(
    private service: MoiPaymentsService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.currentComponent = component
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/moi-payments/step1'])
      }
    }
  }

  approveFirstStep() {
    this.sharedData.approveFlow = true
    this.router.navigate(['/myprofile/pending/moi-payments/step2'])
  }

  rejectFirstStep() {
    this.sharedData.approveFlow = false
    this.router.navigate(['/myprofile/pending/moi-payments/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/moi-payments/step' + this.wizardStep,
    ])
  }

  confirmApprove() {
    this.sharedData['confirmResponse'] = null
    this.authorizeSubscription = this.service
      .confirmAuthorizeBatch(
        this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP,
        this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSR,
        this.sharedData.requestValidate,
      )
      .subscribe(result => {
        if (!result.error) {
          //console.log(this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP);
          //console.log(this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSR);
          this.sharedData['BatchListsContainerSPProcessed'] = this.sharedData
            .showBatchList.checkAndSeparateAuthorizationPermissionSP
            ? this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSP.toProcess
            : []
          this.sharedData['BatchListsContainerSRProcessed'] = this.sharedData
            .showBatchList.checkAndSeparateAuthorizationPermissionSR
            ? this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSR.toProcess
            : []
          this.sharedData['confirmResponse'] = result

          this.sharedData.approveFlow = true
          this.pendingActionNotification.getRefreshObserver().next(true)

          this.rejectReason = ''
          this.cleanSelected()
          this.router.navigate(['/myprofile/pending/moi-payments/step3'])
        }
        if (this.authorizeSubscription) {
          this.authorizeSubscription.unsubscribe()
        }
      })
  }

  confirmReject() {
    this.sharedData['refuseResponse'] = null
    this.authorizeSubscription = this.service
      .confirmRejectBatch(
        this.sharedData.paymentsSelected,
        this.sharedData.refundsSelected,
        this.rejectReason,
      )
      .subscribe(result => {
        if (!result.error) {
          this.sharedData['refuseResponse'] = result
          this.sharedData.approveFlow = false
          this.pendingActionNotification.getRefreshObserver().next(true)

          this.rejectReason = ''
          this.cleanSelected()
          this.router.navigate(['/myprofile/pending/moi-payments/step3'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  isInValid2ndStep() {
    return !this.currentComponent.valid() //return !this.sharedData.requestValidate.valid();
  }

  cleanSelected() {
    this.service.setPaymentsSelected([])
    this.service.setRefundsSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.MOI_PAYMENTS),
      PENDING_ACTION.MOI_PAYMENTS,
    )
  }
}
