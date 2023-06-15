import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { HajjUmrahService } from './Hajj-Umrah.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  selector: 'app-Hajj-Umrah',
  templateUrl: './Hajj-Umrah.component.html',
  styleUrls: ['./Hajj-Umrah.component.scss'],
})
export class HajjUmrahComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  rejectReason: any
  currentComponent: any
  step: any
  authorizeSubscription: Subscription

  constructor(
    public service: HajjUmrahService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {}

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/HajjUmrahCards/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.requestValidate = new RequestValidate()
    if (this.sharedData.selected.length > 0) {
      this.authorizeSubscription = this.service
        .operationDetails(this.sharedData, 'A')
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result

            this.sharedData.aproveFlow = true
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.allocationsSelected.length > 0) {
      this.authorizeSubscription = this.service
        .allocationDetails(this.sharedData, 'A')
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result

            this.sharedData.aproveFlow = true
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  rejectFirstStep() {
    this.sharedData.requestValidate = new RequestValidate()
    if (this.sharedData.selected.length > 0) {
      this.authorizeSubscription = this.service
        .operationDetails(this.sharedData, 'R')
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result

            this.sharedData.aproveFlow = false
            this.rejectReason = null
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.allocationsSelected.length > 0) {
      this.authorizeSubscription = this.service
        .allocationDetails(this.sharedData, 'R')
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result

            this.sharedData.aproveFlow = false
            this.rejectReason = null
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }
  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/Hajj-Umrah/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    if (this.sharedData.selected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeConfirm(
          this.sharedData.responseValidate.batchListsContainerDTO,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.sharedData.listResult = result.detailsToProcess
            this.sharedData['confirm'] = result
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step3'])
          } else {
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.requestValidate = new RequestValidate()
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.allocationsSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeAllocatedConfirm(
          this.sharedData.responseValidate.batchListsContainerDTO,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.sharedData.listResult = result.detailsToProcess
            this.sharedData['confirm'] = result
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.selected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseConfirm(
          this.sharedData.responseValidate.batchListsContainerDTO,
          this.sharedData.rejectReason,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = null

            this.pendingActionNotification.getRefreshObserver().next(true)
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.allocationsSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseAllocatedConfirm(
          this.sharedData.responseValidate.batchListsContainerDTO,
          this.sharedData.rejectReason,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = null

            this.pendingActionNotification.getRefreshObserver().next(true)
            this.wizardStep++
            this.router.navigate(['/myprofile/pending/Hajj-Umrah/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  isValid() {
    return !this.currentComponent.valid() //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.HAJJ_UMRAH_CARDS),
      PENDING_ACTION.HAJJ_UMRAH_CARDS,
    )
  }
}
