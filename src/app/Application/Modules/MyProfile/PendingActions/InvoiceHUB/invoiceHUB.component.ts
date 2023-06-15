import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { InvoiceHUBService } from './invoiceHUB.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './invoiceHUB.component.html',
})
export class InvoiceHUBComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}

  authorizeSubscription: Subscription

  constructor(public service: InvoiceHUBService, public router: Router) {}

  ngOnInit() {
    this.cleanSelected()
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  approveFirstStep() {
    this.sharedData.approveFlow = true
    this.router.navigate(['/myprofile/pending/invoiceHUB/step2'])
  }

  rejectFirstStep() {
    this.sharedData.approveFlow = false
    this.router.navigate(['/myprofile/pending/invoiceHUB/step2'])
  }

  confirmApprove() {
    this.authorizeSubscription = this.service
      .authorizeConfirm(
        this.sharedData['batchList'],
        this.sharedData.requestValidate,
      )
      .subscribe(result => {
        if (!result.error) {
          this.sharedData.validation = result
          this.cleanSelected()
          //console.log(this.sharedData.validation);
          this.router.navigate(['/myprofile/pending/invoiceHUB/step3'])
        } else {
          this.sharedData.validateResponse.generateChallengeAndOTP =
            result.generateChallengeAndOTP

          this.sharedData.requestValidate = new RequestValidate()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  isInValid2ndStep() {
    //console.log(this.sharedData.rejectReason);
    if (!this.sharedData.approveFlow) {
      return true
    }
    if (this.sharedData.approveFlow) {
      return !this.sharedData.valid
    }
    return false
  }

  confirmReject() {
    this.authorizeSubscription = this.service
      .refuseConfirm(
        this.sharedData.tableSelected,
        this.sharedData.rejectReason,
      )
      .subscribe(result => {
        if (!result.error) {
          this.sharedData.validation = result
          this.cleanSelected()
          this.router.navigate(['/myprofile/pending/invoiceHUB/step3'])
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/invoiceHUB/step' + this.wizardStep,
    ])
  }

  cleanSelected() {
    this.service.setSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.ESAL),
      PENDING_ACTION.ESAL,
    )
  }
}
