import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DirectDebitsService } from './direct-debits.service'
import { distinctUntilChanged } from 'rxjs/operators'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './direct-debits.component.html',
})
export class DirectDebitsComponent
  extends AbstractAppComponent
  implements OnInit
{
  wizardStep: number
  sharedData: any = {}
  rejectReason: any
  currentComponent: any

  authorizeSubscription: Subscription
  detailSubscription: Subscription

  currentItem: any = null
  result_model_status: any = null
  detailView = false

  constructor(
    private service: DirectDebitsService,
    private router: Router,
    public translate: TranslateService,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super(translate)
  }

  ngOnInit() {
    this.detailView = false
    this.service.setCurrentItem(null)
    this.subscriptions.push(
      this.service
        .getCurrentItemData()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          this.currentItem = result
        }),
    )

    const currentLang = this.translate.currentLang
    this.subscriptions.push(
      this.service
        .getModel(currentLang, 'batchSecurityLevelStatus')
        .subscribe((result) => {
          this.result_model_status = result
          this.service.result_model_status = this.result_model_status
        }),
    )

    this.cleanSelected()
  }

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/direct-debits/step1'])
      }
    }
  }

  aproveFirstStep() {
    if (this.sharedData.singleSelected.length !== 0) {
      this.sharedData.authorizeValidate = {}
      this.authorizeSubscription = this.service
        .singleValidate(this.sharedData.singleSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.authorizeValidate = result
            this.sharedData.aproveFlow = true
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP
            this.router.navigate(['/myprofile/pending/direct-debits/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.importSelected.length > 0) {
      this.sharedData.authorizeValidate = {}
      this.authorizeSubscription = this.service
        .importsValidate(this.sharedData.importSelected[0])
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.authorizeValidate = result
            this.sharedData.aproveFlow = true
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP
            this.router.navigate(['/myprofile/pending/direct-debits/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.rejectReason = ''
    this.router.navigate(['/myprofile/pending/direct-debits/step2'])
  }

  backButton() {
    this.service.setCurrentItem(null)
    this.detailView = false
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/direct-debits/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    if (this.sharedData.singleSelected.length !== 0) {
      this.authorizeSubscription = this.service
        .singleConfirm(
          this.sharedData.authorizeValidate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.sharedData.aproveFlow = true
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.currentItem = null
            this.cleanSelected()
            this.router.navigate(['/myprofile/pending/direct-debits/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else {
      this.authorizeSubscription = this.service
        .importsConfirm(
          this.sharedData.importSelected[0],
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.sharedData.aproveFlow = true
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.currentItem = null
            this.router.navigate(['/myprofile/pending/direct-debits/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.singleSelected.length > 0) {
      this.authorizeSubscription = this.service
        .singleRefuse(this.sharedData.singleSelected, this.rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.currentItem = null
            this.router.navigate(['/myprofile/pending/direct-debits/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else if (this.sharedData.importSelected.length > 0) {
      this.authorizeSubscription = this.service
        .importsRefuse(this.sharedData.importSelected, this.rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.currentItem = null
            this.router.navigate(['/myprofile/pending/direct-debits/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  isValid() {
    return !this.currentComponent.valid() //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
  }

  closeItem() {
    this.sharedData.importSelected = []
    this.sharedData.singleSelected = []
    this.service.setCurrentItem(null)
  }

  cleanSelected() {
    this.service.setSingleSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.DIRECT_DEBITS),
      PENDING_ACTION.DIRECT_DEBITS,
    )
  }
}
