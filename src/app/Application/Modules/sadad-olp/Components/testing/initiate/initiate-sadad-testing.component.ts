import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'

import { Router } from '@angular/router'

import { Step1Component } from './Steps/Step1/step1.component'
import { AbstractWizardComponent } from '../../../../Common/Components/Abstract/abstract-wizard.component'
import { InitiateSadadTestingService } from './initiate-sadad-testing.service'

@Component({
  templateUrl: './initiate-sadad-testing.component.html',
})
export class InitiateSadadTestingComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  wizardStepsCount = 2

  constructor(
    public fb: FormBuilder,
    public service: InitiateSadadTestingService,
    public translate: TranslateService,
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

  back() {
    return this.router.navigate(['/sadadOLP/olp-initiate-testing'])
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.service
          .startInitiateTesting(this.step1.child.tableSelectedRows)
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.validationResponse = result
              this.markNextWizardStep()
            }
          })
        break
      case 2:
        this.finish()
        break
    }
  }

  previous() {
    this.markPreviousWizardStep()
  }

  finish() {
    this.markPreviousWizardStep()
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }
}
