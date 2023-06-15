import { Component, OnDestroy, OnInit } from '@angular/core'
import { PrepaidCardsService } from './prepaid-cards.service'
import { Router } from '@angular/router'
import { PendingActionsNotificaterService } from 'app/Application/Modules/Common/Components/PendingActions/pending-actions-notificater.service'
import { Subscription } from 'rxjs'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-prepaid-cards',
  templateUrl: './prepaid-cards.component.html',
  styleUrls: ['./prepaid-cards.component.scss'],
})
export class PrepaidCardsComponent implements OnInit, OnDestroy {
  wizardStep: number
  sharedData: any = {}
  rejectReason: any
  currentComponent: any

  subscriptions: Subscription[] = []
  authorizedValidateResultOk = false
  authorizedValidateReplaceResultOk = false
  confirmRejectResultOk = false
  confirmRejectReplaceResultOk = false
  authorizedConfirmResultOk = false
  authorizedConfirmReplaceResultOk = false

  constructor(
    public service: PrepaidCardsService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit(): void {}

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/prepaidCards/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.responseValidate = {}
    this.sharedData.responseValidateReplace = {}

    if (this.paymentsSelected() && !this.replaceSelected()) {
      this.authorizeValidate().then((res) => {
        if (res) {
          this.router.navigate(['/myprofile/pending/prepaidCards/step2'])
        }
      })
    } else if (!this.paymentsSelected() && this.replaceSelected()) {
      this.authorizeValidateReplace().then((res) => {
        if (res) {
          this.router.navigate(['/myprofile/pending/prepaidCards/step2'])
        }
      })
    } else if (this.paymentsSelected() && this.replaceSelected()) {
      this.authorizeValidate().then((res) => {
        if (res) {
          this.authorizedValidateResultOk = true
          if (
            this.authorizedValidateResultOk &&
            this.authorizedValidateReplaceResultOk
          ) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step2'])
          }
        }
      })

      this.authorizeValidateReplace().then((res) => {
        if (res) {
          this.authorizedValidateReplaceResultOk = true
          if (
            this.authorizedValidateResultOk &&
            this.authorizedValidateReplaceResultOk
          ) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step2'])
          }
        }
      })
    }
  }

  private async authorizeValidate(): Promise<any> {
    const result = await this.service
      .authorizeValidate(this.sharedData.tableSelected)
      .toPromise()
    if (!result.error) {
      this.sharedData.responseValidate = result
      this.sharedData.aproveFlow = true
    }
    return result
  }

  private async authorizeValidateReplace(): Promise<any> {
    const result = await this.service
      .authorizeValidateReplace(this.sharedData.replaceTableSelected)
      .toPromise()
    if (!result.error) {
      this.sharedData.responseValidateReplace = result
      this.sharedData.aproveFlow = true
    }
    return result
  }

  private replaceSelected(): boolean {
    return this.sharedData.replaceTableSelected?.length > 0
  }

  private paymentsSelected(): boolean {
    return this.sharedData.tableSelected?.length > 0
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.rejectReason = ''
    this.router.navigate(['/myprofile/pending/prepaidCards/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/prepaidCards/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    if (this.paymentsSelected() && !this.replaceSelected()) {
      this.paymentsAuthorizeConfirm().then((res) => {
        if (res) {
          this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
        }
      })
    } else if (!this.paymentsSelected() && this.replaceSelected()) {
      this.authorizeConfirmReplace().then((res) => {
        if (res) {
          this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
        }
      })
    } else if (this.paymentsSelected() && this.replaceSelected()) {
      this.paymentsAuthorizeConfirm().then((res) => {
        if (res) {
          this.authorizedConfirmResultOk = true
          if (
            this.authorizedConfirmResultOk &&
            this.authorizedConfirmReplaceResultOk
          ) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
          }
        }
      })

      this.authorizeConfirmReplace().then((res) => {
        if (res) {
          this.authorizedConfirmReplaceResultOk = true
          if (
            this.authorizedConfirmResultOk &&
            this.authorizedConfirmReplaceResultOk
          ) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
          }
        }
      })
    }
  }

  private async paymentsAuthorizeConfirm(): Promise<any> {
    const result = await this.service
      .authorizeConfirm(
        this.sharedData.responseValidate.batchList,
        this.sharedData.requestValidate,
      )
      .toPromise()

    if (!result.error) {
      this.sharedData.validation = result
      this.sharedData['confirm'] = result
      this.pendingActionNotification.getRefreshObserver().next(true)
    } else {
      this.sharedData.validateResponse.generateChallengeAndOTP =
        result.generateChallengeAndOTP
      this.sharedData.requestValidate = new RequestValidate()
    }

    return result
  }

  private async authorizeConfirmReplace(): Promise<any> {
    const result = await this.service
      .authorizeConfirmReplace(
        this.sharedData.responseValidateReplace.batchList,
        this.sharedData.requestValidate,
      )
      .toPromise()

    if (!result.error) {
      this.sharedData.validationReplace = result
      this.sharedData['confirmReplace'] = result
      this.pendingActionNotification.getRefreshObserver().next(true)
    } else {
      this.sharedData.validateResponse.generateChallengeAndOTP =
        result.generateChallengeAndOTP
      this.sharedData.requestValidate = new RequestValidate()
    }

    return result
  }

  confirmReject() {
    if (this.paymentsSelected() && !this.replaceSelected()) {
      this.paymentConfirmReject().then((res) => {
        if (res) {
          this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
        }
      })
    } else if (!this.paymentsSelected() && this.replaceSelected()) {
      this.confirmRejectReplace().then((res) => {
        this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
      })
    } else if (this.paymentsSelected() && this.replaceSelected()) {
      this.paymentConfirmReject().then((res) => {
        if (res) {
          this.confirmRejectResultOk = true
          if (this.confirmRejectResultOk && this.confirmRejectReplaceResultOk) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
          }
        }
      })

      this.confirmRejectReplace().then((res) => {
        if (res) {
          this.confirmRejectReplaceResultOk = true
          if (this.confirmRejectResultOk && this.confirmRejectReplaceResultOk) {
            this.router.navigate(['/myprofile/pending/prepaidCards/step3'])
          }
        }
      })
    }
  }

  private async paymentConfirmReject(): Promise<any> {
    const result = await this.service
      .refuseConfirm(
        this.sharedData.tableSelected,
        this.sharedData.rejectReason,
      )
      .toPromise()
    if (!result.error) {
      this.sharedData['confirm'] = { ...this.sharedData.confirm, result }
      this.pendingActionNotification.getRefreshObserver().next(true)
    }
    return result
  }

  private async confirmRejectReplace(): Promise<any> {
    const result = await this.service
      .refuseConfirmReplace(
        this.sharedData.replaceTableSelected,
        this.sharedData.rejectReason,
      )
      .toPromise()
    if (!result.error) {
      this.sharedData['confirm'] = { ...this.sharedData.confirm, result }
      this.pendingActionNotification.getRefreshObserver().next(true)
    }
    return result
  }

  isValid() {
    return !this.currentComponent.valid()
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.PREPAID_CARDS),
      PENDING_ACTION.PREPAID_CARDS,
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
