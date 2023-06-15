import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Router } from '@angular/router'

import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { AbstractWizardComponent } from '../../../../../Common/Components/Abstract/abstract-wizard.component'
import { CardOperationsReactivateEntityService } from './card-operations-reactivate-entity.service'
import { CardOperationsRequestService } from '../card-operations-request.service'

@Component({
  templateUrl: './card-operations-reactivate.component.html',
})
export class CardOperationsReactivateComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  step2: Step2Component

  action: string
  wizardStepsCount = 3

  constructor(
    public fb: FormBuilder,
    public service: CardOperationsRequestService,
    public translate: TranslateService,
    private serviceData: CardOperationsReactivateEntityService,
    public router: Router,
  ) {
    super(fb, translate, router)
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
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  isDisabled() {
    return true
  }

  back() {
    return this.router.navigate(['/hajjandumrahcards/reqStatus'])
  }

  valid() {
    return true
  }

  isBackAllowed() {
    return false
  }

  next() {}

  nextAction(action) {
    this.action = action
    switch (this.wizardStep) {
      case 1:
        if (this.action === 'D') {
          this.markNextWizardStep()
        } else {
          const address = this.step1.child.form.controls.address
            ? this.step1.child.form.controls.address.value
            : null
          const city = this.step1.child.form.controls.city
            ? this.step1.child.form.controls.city.value
            : null
          const country = this.step1.child.form.controls.country
            ? this.step1.child.form.controls.country.value
            : null
          const email = this.step1.child.form.controls.email
            ? this.step1.child.form.controls.email.value
            : null
          const mobileKSA = this.step1.child.form.controls.mobileKSA
            ? this.step1.child.form.controls.mobileKSA.value
            : null
          const mobileNumber = this.step1.child.form.controls.mobileNumber
            ? this.step1.child.form.controls.mobileNumber.value
            : null
          const newCardNumber = this.step1.child.form.controls.newCardNumber
            ? this.step1.child.form.controls.newCardNumber.value
            : null
          const postalCode = this.step1.child.form.controls.postalCode
            ? this.step1.child.form.controls.postalCode.value
            : null
          const stateRegion = this.step1.child.form.controls.stateRegion
            ? this.step1.child.form.controls.stateRegion.value
            : null

          var amount = 0
          if (this.step1.child.operationType === 'PR') {
            amount = this.step1.child.form.controls.refundAmount.value
          } else if (this.step1.child.operationType === 'LD') {
            amount = this.step1.child.form.controls.loadAmount.value
          }
          this.service
            .requestStatusCardsOperationValidate(
              address,
              amount,
              city,
              country,
              email,
              mobileKSA,
              mobileNumber,
              newCardNumber,
              postalCode,
              stateRegion,
              this.serviceData.getSelectedData().selectedOperation,
            )
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.serviceData.clear()
                this.serviceData.setSelectedData(result)
                this.markNextWizardStep()
              }
            })
        }
        break
      case 2:
        if (this.action === 'D') {
          this.service
            .requestStatusCardsOperationDelete(
              this.serviceData.getSelectedData().selectedOperation,
            )
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.markNextWizardStep()
              }
            })
        } else {
          this.service
            .requestStatusCardsOperationConfirm(
              this.serviceData.getSelectedData().selectedOperation,
              this.step2.requestValidate,
            )
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.markNextWizardStep()
              }
            })
        }
        break
      case 3:
        this.finish()
        break
    }
  }

  previous() {
    this.markPreviousWizardStep()
  }

  finish() {
    return this.router.navigate(['/hajjandumrahcards/reqStatus'])
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }

  isValid() {
    return this.step1.child.form && !this.step1.child.form.valid
  }
}
