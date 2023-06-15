import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { ManageOLPRefundEntityService } from './refund-sadad-olp-entity.service'
import { RefundSadadOLPService } from './refund-sadad-olp.service'
import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { Step3Component } from './Steps/Step3/step3.component'

@Component({
  templateUrl: './refund-sadad-olp.component.html',
})
export class RefundSadadOLPComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  step2: Step2Component
  step3: Step3Component
  formRefunds: FormGroup

  wizardStepsCount = 4

  constructor(
    public fb: FormBuilder,
    public service: RefundSadadOLPService,
    public translate: TranslateService,
    private serviceData: ManageOLPRefundEntityService,
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
      genericRefundRejectReason: ['', [Validators.maxLength(150)]],
    })
  }

  get refundsControls(): any[] {
    return this.formRefunds.controls.refunds['controls']
  }

  ngOnInit() {
    super.ngOnInit()
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
      case 3:
        this.step3 = events
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

  isBackAllowed() {
    return false
  }

  isNextAllowed() {
    return this.wizardStep !== 2
  }

  isApproveRejectAllowed() {
    return this.wizardStep === 2
  }

  back() {
    return this.router.navigate(['/sadadOLP/olp-refunds'])
  }

  next() {}

  nextAction(action) {
    switch (this.wizardStep) {
      case 1:
        this.formRefunds.controls.refunds = this.fb.array([])
        this.markNextWizardStep()
        break
      case 2:
        this.service
          .validateRefund(this.formRefunds.getRawValue(), action)
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.validationResponse = result
              this.serviceData.clear()
              this.serviceData.setSelectedData(
                this.formRefunds.getRawValue().refunds,
              )
              this.formRefunds.controls.refunds = this.fb.array([])
              this.serviceData.setData(result.batchList)
              this.markNextWizardStep()
            }
          })
        break
      case 3:
        this.service
          .confirmRefund(this.serviceData.getData())
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.confirmResponse = result
              this.markNextWizardStep()
            }
          })
        break
      case 4:
        this.finish()
        break
    }
  }

  clearForm() {
    this.formRefunds.controls.refunds = this.fb.array([])
  }

  previous() {
    this.markPreviousWizardStep()
  }

  finish() {
    super.finish()
    return this.router.navigate(['/sadadOLP/olp-refunds'])
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }
}
