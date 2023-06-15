import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { BeneficiariesService } from './beneficiaries.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

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
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/beneficiaries/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.authorizeValidate = {}
    this.authorizeSubscription = this.service
      .authorizeValidate(this.sharedData.beneficiariesSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.authorizeValidate = result
          // console.log(this.sharedData.authorizeValidate );
          this.sharedData.aproveFlow = true
          this.router.navigate(['/myprofile/pending/beneficiaries/step2'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.sharedData.rejectReason = null
    this.router.navigate(['/myprofile/pending/beneficiaries/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/beneficiaries/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData.authorizeValidate,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        this.authorizeSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.responseMultipleAuthorizeConfirm = result
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/beneficiaries/step3'])
        } else {
          this.sharedData.authorizeValidate.generateChallengeAndOTP =
            result.generateChallengeAndOTP
          this.sharedData.requestValidate = new RequestValidate()
        }
      })
  }

  confirmReject() {
    this.authorizeSubscription = this.service
      .refuseConfirm(
        this.sharedData.beneficiariesSelected,
        this.sharedData.rejectReason,
      )
      .subscribe((result) => {
        this.authorizeSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.responseMultipleAuthorizeConfirm = result
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/beneficiaries/step3'])
        }
      })
  }

  cleanSelected() {
    this.sharedData.beneficiariesSelected = []
    this.service.tableSelectedRows = []
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.BENEFICIARIES),
      PENDING_ACTION.BENEFICIARIES,
    )
  }
}
