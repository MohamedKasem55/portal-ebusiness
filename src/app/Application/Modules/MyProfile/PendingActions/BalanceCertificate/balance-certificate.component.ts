import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { BalanceCertificateService } from './balance-certificate.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './balance-certificate.component.html',
})
export class BalanceCertificateComponent implements OnInit {
  componentStep: any
  wizardStep: number
  sharedData: any = {}
  baseRoute = '/myprofile/pending/balance-certificate/'

  authorizeSubscription: Subscription

  constructor(
    public service: BalanceCertificateService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    this.componentStep = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  aproveFirstStep() {
    this.sharedData.requestValidate = new RequestValidate()
    this.authorizeSubscription = this.service
      .authorizeValidate(this.sharedData.tableSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.generateChallengeAndOTP =
            result.generateChallengeAndOTP
          this.sharedData.validate = result.batchList
          this.sharedData.aproveFlow = true
          this.router.navigate([this.baseRoute + 'step2'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  rejectFirstStep() {
    this.sharedData.rejectReason = null
    this.sharedData.aproveFlow = false
    this.router.navigate([this.baseRoute + 'step2'])
  }

  confirmAprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData.validate,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.validation = result
          this.cleanSelected()
          this.router.navigate([this.baseRoute + 'step3'])
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
      .refuseConfirm(
        this.sharedData.tableSelected,
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

  backButton() {
    this.wizardStep--
    this.router.navigate([this.baseRoute + 'step' + this.wizardStep])
  }

  cleanSelected() {
    this.service.tableSelectedRows = []
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.BALANCE_CERTIFICATE),
      PENDING_ACTION.BALANCE_CERTIFICATE,
    )
  }
}
