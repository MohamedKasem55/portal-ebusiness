import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { StandingOrdersService } from './standing-orders.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './standing-orders.component.html',
})
export class StandingOrdersComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  authorizeSubscription: Subscription
  rejectReason: any
  constructor(
    private service: StandingOrdersService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  currentComponent: Component

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    this.currentComponent = component
    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/standing-orders/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.authorizeValidate = {}
    this.sharedData.requestValidate = new RequestValidate()
    this.authorizeSubscription = this.service
      .authorizeValidate(this.sharedData.tableSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.authorizeValidate = result
          this.sharedData.aproveFlow = true
          this.sharedData.showOTP =
            this.sharedData.authorizeValidate.generateChallengeAndOTP !== null
          this.router.navigate(['/myprofile/pending/standing-orders/step2'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  rejectFirstStep() {
    this.sharedData.refuseValidate = {}
    this.sharedData.requestValidate = new RequestValidate()
    this.authorizeSubscription = this.service
      .refuseValidate(this.sharedData.tableSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.refuseValidate = result
          this.sharedData.aproveFlow = false
          this.sharedData.showOTP =
            this.sharedData.refuseValidate.generateChallengeAndOTP !== null
          this.router.navigate(['/myprofile/pending/standing-orders/step2'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/standing-orders/step' + this.wizardStep,
    ])
  }

  validate() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData.authorizeValidate.authorizationPermission,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/standing-orders/step3'])
        } else {
          this.sharedData.validateResponse.generateChallengeAndOTP =
            result.generateChallengeAndOTP

          this.sharedData.requestValidate = new RequestValidate()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData.authorizeValidate.authorizationPermission,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/standing-orders/step3'])
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
      .refuseConfirm(this.sharedData.refuseValidate, this.rejectReason)
      .subscribe((result) => {
        if (!result.error) {
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/standing-orders/step3'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  cleanSelected() {
    this.service.setTableSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.STANDING_ORDERS),
      PENDING_ACTION.STANDING_ORDERS,
    )
  }
}
