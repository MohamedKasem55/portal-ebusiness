import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { BillPaymentsService } from './bill-payments.service'
import { Step2Component } from './components/Step2/step2.component'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './bill-payments.component.html',
})
export class BillPaymentsComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  component: Step2Component
  authorizeSubscription: Subscription

  constructor(
    public service: BillPaymentsService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {
    this.service.getBillCodes().subscribe(result => {
      if (result.error) {
      } else {
        this.sharedData.billCodes = result.billCodes
      }
    })
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    if (this.wizardStep == 2) {
      this.component = component
    }
  }

  approveFirstStep() {
    this.sharedData.responseValidate = {}
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeValidate(this.sharedData.tableSelected)
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.sharedData.approveFlow = true
            this.router.navigate(['/myprofile/pending/bill-payments/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (this.sharedData.tableBillerSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeBillerValidate(this.sharedData.tableBillerSelected)
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.sharedData.approveFlow = true
            this.router.navigate(['/myprofile/pending/bill-payments/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  rejectFirstStep() {
    this.sharedData.rejectReason = null
    this.sharedData.approveFlow = false
    this.router.navigate(['/myprofile/pending/bill-payments/step2'])
  }

  confirmApprove() {
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeConfirm(
          this.sharedData.responseValidate.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.validation = result
            //console.log(this.sharedData.validation);
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/bill-payments/step3'])
          } else {
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.requestValidate = new RequestValidate()
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (this.sharedData.tableBillerSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeBillerConfirm(
          this.sharedData.responseValidate.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.validation = result
            //console.log(this.sharedData.validation);
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/bill-payments/step3'])
          } else {
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.requestValidate = new RequestValidate()
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseConfirm(
          this.sharedData.tableSelected,
          this.sharedData.rejectReason,
        )
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.validation = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/bill-payments/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (this.sharedData.tableBillerSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseBillerConfirm(
          this.sharedData.tableBillerSelected,
          this.sharedData.rejectReason,
        )
        .subscribe(result => {
          if (!result.error) {
            this.sharedData.validation = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/bill-payments/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/bill-payments/step' + this.wizardStep,
    ])
  }

  validApprove() {
    const valid = true
    if (this.component.valid() !== undefined && this.sharedData.approveFlow) {
      return this.component.valid()
    }
    return valid
  }
  cleanSelected() {
    this.service.setBillSelected([])
    this.service.setBillPaymentsSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.BILL_PAYMENTS),
      PENDING_ACTION.BILL_PAYMENTS,
    )
  }
}
