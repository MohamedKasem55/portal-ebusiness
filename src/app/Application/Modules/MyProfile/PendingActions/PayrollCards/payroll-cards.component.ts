import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { PayrollCardsService } from './payroll-cards.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './payroll-cards.component.html',
})
export class PayrollCardsComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  rejectReason: string
  subscription: Subscription
  currentComponent: any
  rol: any

  constructor(
    private service: PayrollCardsService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {
    this.subscription = this.service.getUserRol().subscribe((res) => {
      this.rol = res.institutionDTO.layout
      this.rol.toLowerCase()

      this.subscription.unsubscribe()
    })
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.currentComponent = component
    component.rol = this.rol
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.aproveFlow = true
    this.router.navigate(['/myprofile/pending/payroll-cards/step2'])
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/payroll-cards/step2'])
  }

  backButton() {
    this.rejectReason = ''
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/payroll-cards/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    if (this.sharedData.operationsSelected.length !== 0) {
      this.subscription = this.service
        .operationsAproveConfirm(
          this.sharedData.responseValidate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.listResult = result.listResult
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.paymentsSelected.length !== 0) {
      this.subscription = this.service
        .paymentsAproveConfirm(
          this.sharedData.responseValidate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.uploadFilesSelected.length !== 0) {
      this.subscription = this.service
        .uploadFilesAproveConfirm(
          this.sharedData.responseValidate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.payrolCardsSelected.length !== 0) {
      this.subscription = this.service
        .newCardAproveConfirm(
          this.sharedData.responseValidate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.sharedData.listNew = result.list
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.operationsSelected.length !== 0) {
      this.sharedData.responseValidate.rejectionReason = this.rejectReason
      this.subscription = this.service
        .operationsRejectConfirm(this.sharedData.responseValidate)
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.paymentsSelected.length !== 0) {
      this.sharedData.responseValidate.rejectionReason = this.rejectReason
      this.subscription = this.service
        .paymentsRejectConfirm(this.sharedData.responseValidate)
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.uploadFilesSelected.length !== 0) {
      this.sharedData.responseValidate.rejectionReason = this.rejectReason
      this.subscription = this.service
        .uploadFilesRejectConfirm(this.sharedData.responseValidate)
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
          }
          this.subscription.unsubscribe()
        })
    } else if (this.sharedData.payrolCardsSelected.length !== 0) {
      this.sharedData.responseValidate.rejectionReason = this.rejectReason
      this.subscription = this.service
        .newCardRejectConfirm(this.sharedData.responseValidate)
        .subscribe((result) => {
          if (!result.error) {
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll-cards/step3'])
            this.sharedData.listNew = result.listNew
          }
          this.subscription.unsubscribe()
        })
    }
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.PAYROLL_CARDS),
      PENDING_ACTION.PAYROLL_CARDS,
    )
  }

  isValid() {
    return !this.currentComponent.valid() //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
  }

  cleanSelected() {
    this.service.tableSelectedRowsOperations = []
    this.service.tableSelectedRowsPayments = []
    this.service.tableSelectedRowsUploadFiles = []
    this.service.tableSelectedRowsNewCards = []
  }
}
