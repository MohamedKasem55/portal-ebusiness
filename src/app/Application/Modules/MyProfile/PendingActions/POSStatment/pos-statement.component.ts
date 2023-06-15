import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { POSStatementService } from './pos-statement.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './pos-statement.component.html',
})
export class POSStatementComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  rejectReason = ''

  subscription: Subscription

  constructor(
    private service: POSStatementService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {
    this.sharedData.requestValidate = {}
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/pos-statement/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.aproveFlow = true
    this.sharedData.requestValidate = new RequestValidate()
    this.subscription = this.service
      .validate(this.sharedData)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.responseValidate = result
          this.router.navigate(['/myprofile/pending/pos-statement/step2'])
        }
        this.subscription.unsubscribe()
      })
  }

  rejectFirstStep() {
    this.rejectReason = ''
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/pos-statement/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/pos-statement/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    this.subscription = this.service
      .aproveConfirm(
        this.sharedData.responseValidate,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.rejectReason = ''
          this.sharedData.confirmAproveResponse = result
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/pos-statement/step3'])
        }

        this.subscription.unsubscribe()
      })
  }

  confirmReject() {
    this.subscription = this.service
      .rejectConfirm(this.sharedData, this.rejectReason)
      .subscribe((result) => {
        if (!result.error) {
          this.rejectReason = ''
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/myprofile/pending/pos-statement/step3'])
        }
        this.subscription.unsubscribe()
      })
  }
}
