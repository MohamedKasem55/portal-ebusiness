import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { interval, Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { WorkflowDetailsPopupComponent } from '../Component/workflow-details-popup/workflow-details-popup.component'
import {
  PENDING_ACTION,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
} from './../Component/workflow-details-popup/workflow-details-popup.component'
import { TransfersService } from './transfers.service'

@UntilDestroy()
@Component({
  templateUrl: './transfers.component.html',
})
export class TransfersComponent implements OnInit, OnDestroy {
  wizardStep: number
  sharedData: any = {}
  currentComponent: any

  authorizeSubscription: Subscription
  segment: any

  constructor(
    private service: TransfersService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
    private storeservice: StorageService,
  ) {
    const currentseg = this.storeservice.retrieve('welcome')
    this.segment = currentseg.segment
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    this.currentComponent = component
  }

  aproveFirstStep() {
    this.sharedData.requestValidate = new RequestValidate()
    this.sharedData.validateResponse = new ResponseGenerateChallenge()
    this.authorizeSubscription = this.service
      .validate(this.sharedData.selected, this.segment)
      .subscribe((result) => {
        this.authorizeSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.validateResponse = result
          this.sharedData.aproveFlow = true
          console.log(this.sharedData.validateResponse)
          this.router.navigate(['/myprofile/pending/transfers/step2'])
        }
      })
  }

  rejectFirstStep() {
    this.sharedData.rejectReason = ''
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/transfers/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/transfers/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .confirm(
        this.sharedData.validateResponse.withinAuthorizationPermission,
        this.sharedData.validateResponse.ownAuthorizationPermission,
        this.sharedData.validateResponse.localAuthorizationPermission,
        this.sharedData.validateResponse.internationalAuthorizationPermission,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/transfers/step3'])
        } else {
          this.sharedData.validateResponse.generateChallengeAndOTP =
            result.generateChallengeAndOTP
          //this.sharedData.validateResponse = result.requestValidate;
          this.sharedData.requestValidate = new RequestValidate()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  confirmReject() {
    this.authorizeSubscription = this.service
      .refuse(this.sharedData.selected, this.sharedData.rejectReason)
      .subscribe((result) => {
        if (!result.error) {
          this.cleanSelected()
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/transfers/step3'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  isInValid2ndStep() {
    return !this.currentComponent.valid()
  }

  cleanSelected() {
    this.service.setSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.TRANSFERS),
      PENDING_ACTION.TRANSFERS,
    )
  }

  ngOnDestroy() {
    // You can also do whatever you need here
  }
}
