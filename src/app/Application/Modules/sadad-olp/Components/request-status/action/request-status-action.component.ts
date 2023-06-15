import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AbstractWizardComponent } from '../../../../Common/Components/Abstract/abstract-wizard.component'
import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { RequestStatusActionService } from './request-status-action.service'
import { ManageRequestStatusRefundsEntityService } from '../request-status-refunds-entity.service'
import { ManageRequestStatusDisputesEntityService } from '../request-status-disputes-entity.service'

@Component({
  templateUrl: './request-status-action.component.html',
})
export class RequestStatusActionComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  step2: Step2Component
  formRefunds: FormGroup
  formDisputes: FormGroup

  wizardStepsCount = 3
  action: string

  constructor(
    public fb: FormBuilder,
    public service: RequestStatusActionService,
    public translate: TranslateService,
    private serviceRefundsData: ManageRequestStatusRefundsEntityService,
    private serviceDisputesData: ManageRequestStatusDisputesEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.formRefunds = fb.group({
      refunds: fb.array([
        fb.group({
          transactionAmount: [],
          transactionDate: [],
          requestedAmount: [],
          reason: [],
          requestedDate: [],
          status: [],
          approvedAmount: [],
          refundRejectionReason: [],
          resolutionRemarks: [],
          refundID: [],
          transactionID: [],
        }),
      ]),
    })
    this.formDisputes = fb.group({
      refunds: fb.array([
        fb.group({
          transactionAmount: [],
          transactionDate: [],
          amount: [],
          categoryDescription: [],
          disputeStatus: [],
          status: [],
          details: [],
          assignedTo: [],
          disputeId: [],
          transactionId: [],
        }),
      ]),
    })
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  isDisabled() {
    return true
  }

  valid() {
    return true
  }

  reinitiateDisputes() {
    this.service
      .reInitiateDisputes(
        this.serviceDisputesData.getSelectedData(),
        this.formDisputes.getRawValue(),
      )
      .subscribe((result) => {
        if (result['errorCode'] !== '0') {
          this.onError(result)
        } else {
          this.validationResponse = result
          this.serviceDisputesData.clear()
          this.formDisputes.controls.disputes = this.fb.array([])
          this.serviceDisputesData.setSelectedData(result.batchList)

          this.markNextWizardStep()
        }
      })
  }

  nextAction(action) {
    this.action = action
    switch (this.wizardStep) {
      case 1:
        if (this.action === 'I') {
          if (
            this.serviceRefundsData.getSelectedData() &&
            this.serviceRefundsData.getSelectedData().length > 0
          ) {
            this.service
              .reInitiateRefunds(
                this.serviceRefundsData.getSelectedData(),
                this.formRefunds.getRawValue(),
              )
              .subscribe((result) => {
                if (result['errorCode'] !== '0') {
                  this.onError(result)
                } else {
                  this.validationResponse = result
                  this.serviceRefundsData.clear()
                  this.formRefunds.controls.refunds = this.fb.array([])
                  this.serviceRefundsData.setSelectedData(result.batchList)

                  if (
                    this.serviceDisputesData.getSelectedData() &&
                    this.serviceDisputesData.getSelectedData().length > 0
                  ) {
                    this.reinitiateDisputes()
                  } else {
                    this.markNextWizardStep()
                  }
                }
              })
          } else if (
            this.serviceDisputesData.getSelectedData() &&
            this.serviceDisputesData.getSelectedData().length > 0
          ) {
            this.reinitiateDisputes()
          }
        } else {
          this.markNextWizardStep()
        }
        break
    }
  }

  saveReInitiateDisputes() {
    this.service
      .saveReInitiateDisputes(this.serviceDisputesData.getSelectedData())
      .subscribe((result) => {
        if (result['errorCode'] !== '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      })
  }

  deleteDisputes() {
    this.service
      .deleteDisputes(this.serviceDisputesData.getSelectedData())
      .subscribe((result) => {
        if (result['errorCode'] !== '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      })
  }

  next() {
    switch (this.wizardStep) {
      case 2:
        if (this.action === 'I') {
          if (
            this.serviceRefundsData.getSelectedData() &&
            this.serviceRefundsData.getSelectedData().length > 0
          ) {
            this.service
              .saveReInitiateRefunds(this.serviceRefundsData.getSelectedData())
              .subscribe((result) => {
                if (result['errorCode'] !== '0') {
                  this.onError(result)
                } else {
                  this.confirmResponse = result

                  if (
                    this.serviceDisputesData.getSelectedData() &&
                    this.serviceDisputesData.getSelectedData().length > 0
                  ) {
                    this.saveReInitiateDisputes()
                  } else {
                    this.markNextWizardStep()
                  }
                }
              })
          } else if (
            this.serviceDisputesData.getSelectedData() &&
            this.serviceDisputesData.getSelectedData().length > 0
          ) {
            this.saveReInitiateDisputes()
          }
        } else {
          if (
            this.serviceRefundsData.getSelectedData() &&
            this.serviceRefundsData.getSelectedData().length > 0
          ) {
            this.service
              .deleteRefunds(this.serviceRefundsData.getSelectedData())
              .subscribe((result) => {
                if (result['errorCode'] !== '0') {
                  this.onError(result)
                } else {
                  this.confirmResponse = result

                  if (
                    this.serviceDisputesData.getSelectedData() &&
                    this.serviceDisputesData.getSelectedData().length > 0
                  ) {
                    this.deleteDisputes()
                  } else {
                    this.markNextWizardStep()
                  }
                }
              })
          } else if (
            this.serviceDisputesData.getSelectedData() &&
            this.serviceDisputesData.getSelectedData().length > 0
          ) {
            this.deleteDisputes()
          }
        }
        break
      case 3:
        this.finish()
        break
    }
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }

  previous() {
    this.markPreviousWizardStep()
  }

  finish() {
    super.finish()
    this.router.navigate(['/sadadOLP/olp-request-status'])
  }

  clearForm() {
    this.formRefunds.controls.refunds = this.fb.array([])
  }

  back() {
    this.router.navigate(['/sadadOLP/olp-request-status'])
  }
}
