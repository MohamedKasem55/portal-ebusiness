import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AbstractWizardComponent } from '../../../../Common/Components/Abstract/abstract-wizard.component'
import { Step1Component } from './Steps/Step1/step1.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { CloseOLPNotificationsService } from './close-notifications.service'
import { ManageOLPNotificationEntityService } from '../olp-notifications-entity.service'

@Component({
  templateUrl: './close-notifications.component.html',
})
export class CloseOLPNotificationsComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  formDepOrigNames: FormGroup

  wizardStepsCount = 3

  constructor(
    public fb: FormBuilder,
    public service: CloseOLPNotificationsService,
    public translate: TranslateService,
    private serviceData: ManageOLPNotificationEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.formDepOrigNames = fb.group({
      depOrigNames: fb.array([]),
    })
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
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

  next() {
    switch (this.wizardStep) {
      case 1:
        this.markNextWizardStep()
        break
      case 2:
        this.service
          .close(this.serviceData.getSelectedData())
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.confirmResponse = result
              this.markNextWizardStep()
            }
          })
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
    this.router.navigate(['/sadadOLP/olp-notifications'])
  }

  clearForm() {}

  back() {
    this.router.navigate(['/sadadOLP/olp-notifications'])
  }
}
