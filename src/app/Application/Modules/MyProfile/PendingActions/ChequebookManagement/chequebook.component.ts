import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { RequestValidate } from '../../../../Model/requestvalidateType'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { ChequebookService } from './chequebook.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './chequebook.component.html',
})
export class ChequebookComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  rejectReason: string

  authorizeSubscription: Subscription

  constructor(
    public service: ChequebookService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {}

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  async aproveFirstStep() {
    this.sharedData.create = {}
    this.sharedData.stop = {}
    this.sharedData.positivePay = {}
    this.sharedData.requestValidate = new RequestValidate()

    let validateError: boolean = true

    if (
      this.sharedData.tableSelected &&
      this.sharedData.tableSelected.length > 0
    ) {
      await this.service
        .authorizeValidate(this.sharedData.tableSelected)
        .toPromise()
        .then((result) => {
          if (!result.error) {
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.create.batchList = result.batchList
            this.sharedData.aproveFlow = true
            validateError = false
          }
        })
    }

    if (
      this.sharedData.tableStopSelected &&
      this.sharedData.tableStopSelected.length > 0
    ) {
      await this.service
        .authorizeValidateStopCheque(this.sharedData.tableStopSelected)
        .toPromise()
        .then((result) => {
          if (!result.error) {
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.stop.batchList = result.batchList
            this.sharedData.aproveFlow = true
            validateError = false
          }
        })
    }

    if (
      this.sharedData.tablePositivePaySelected &&
      this.sharedData.tablePositivePaySelected.length > 0
    ) {
      await this.service
        .authorizeValidatePositivePay(this.sharedData.tablePositivePaySelected)
        .toPromise()
        .then((result) => {
          if (!result.error) {
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.positivePay.batchList = result.batchList
            this.sharedData.aproveFlow = true
            validateError = false
          }
        })
    }

    if (!validateError)
      this.router.navigate(['/myprofile/pending/chequebook/step2'])
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/chequebook/step2'])
  }

  confirmAprove() {
    if (
      this.sharedData.tableSelected &&
      this.sharedData.tableSelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .authorizeConfirm(
          this.sharedData.create.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.service.tableSelectedRows = []
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          } else {
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.requestValidate = new RequestValidate()
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (
      this.sharedData.tableStopSelected &&
      this.sharedData.tableStopSelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .authorizeConfirmStopCheque(
          this.sharedData.stop.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.service.tableStopSelectedRows = []
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (
      this.sharedData.tablePositivePaySelected &&
      this.sharedData.tablePositivePaySelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .authorizeConfirmPositivePay(
          this.sharedData.positivePay.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.service.tablePositivePaySelectedRows = []
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (
      this.sharedData.tableSelected &&
      this.sharedData.tableSelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .refuseConfirm(this.sharedData.tableSelected, this.rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.service.tableSelectedRows = []
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (
      this.sharedData.tableStopSelected &&
      this.sharedData.tableStopSelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .refuseConfirmStopCheque(
          this.sharedData.tableStopSelected,
          this.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            //console.log(this.sharedData.validation);
            this.service.tableStopSelectedRows = []
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (
      this.sharedData.tablePositivePaySelected &&
      this.sharedData.tablePositivePaySelected.length > 0
    ) {
      this.authorizeSubscription = this.service
        .refuseConfirmPositivePay(
          this.sharedData.tablePositivePaySelected,
          this.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            //console.log(this.sharedData.validation);
            this.service.tablePositivePaySelectedRows = []
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/chequebook/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/chequebook/step' + this.wizardStep,
    ])
  }

  isInValid2ndStep() {
    return (
      this.sharedData.generateChallengeAndOTP &&
      !this.sharedData.requestValidate.valid()
    )
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(
        PENDING_ACTION.CHEQUE_BOOK_MANAGEMENT,
      ),
      PENDING_ACTION.CHEQUE_BOOK_MANAGEMENT,
    )
  }
}
