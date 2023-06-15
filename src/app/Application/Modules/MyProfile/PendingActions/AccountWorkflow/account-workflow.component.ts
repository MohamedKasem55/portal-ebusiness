import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AccountWorkflowService } from './account-workflow.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './account-workflow.component.html',
})
export class AccountWorkflowComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  baseRoute = '/myprofile/pending/account-workflow/'

  authorizeSubscription: Subscription

  constructor(public service: AccountWorkflowService, public router: Router) {}

  ngOnInit() {}

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  aproveFirstStep() {
    this.sharedData.requestValidate = new RequestValidate()
    if (this.sharedData.tableAccountSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeValidate(this.sharedData.tableAccountSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP
            this.sharedData.validate = result.workflowAccountBatchList
            this.sharedData.aproveFlow = true
            this.router.navigate([this.baseRoute + 'step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }

    if (this.sharedData.tableNonfinancialSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeNonfinanceValidate(this.sharedData.tableNonfinancialSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.generateChallengeAndOTP =
              result.generateChallengeAndOTP
            this.sharedData.validate = result.workflowNonFinancialBatchList
            this.sharedData.aproveFlow = true
            this.router.navigate([this.baseRoute + 'step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  rejectFirstStep() {
    this.sharedData.rejectReason = null
    this.sharedData.aproveFlow = false
    this.router.navigate([this.baseRoute + 'step2'])
  }

  confirmAprove() {
    if (this.sharedData.tableAccountSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeConfirm(
          this.sharedData.validate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.router.navigate([this.baseRoute + 'step3'])
          } else {
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP

            this.sharedData.requestValidate = new RequestValidate()
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (this.sharedData.tableNonfinancialSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeNonfinanceConfirm(
          this.sharedData.validate,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.router.navigate([this.baseRoute + 'step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.tableAccountSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseConfirm(
          this.sharedData.tableAccountSelected,
          this.sharedData.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.router.navigate([this.baseRoute + 'step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
    if (this.sharedData.tableNonfinancialSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseNonfinanceConfirm(
          this.sharedData.tableNonfinancialSelected,
          this.sharedData.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result
            this.router.navigate([this.baseRoute + 'step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([this.baseRoute + 'step' + this.wizardStep])
  }
}
