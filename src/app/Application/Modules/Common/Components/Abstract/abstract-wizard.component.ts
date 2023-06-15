import { OnDestroy, OnInit, Directive } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AbstractAppComponent } from './abstract-app.component'

@Directive()
export abstract class AbstractWizardComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  formModel: FormGroup

  wizardStep = 1
  wizardStepsCount: number

  validationResponse: any = {}
  confirmResponse: any = {}
  requestValidate: any = {}

  protected constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
  ) {
    super(translate)
    this.wizardStep = 1
    this.wizardStepsCount = this.getWizardStepsCount()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  abstract onInitStep(step, events)

  abstract isDisabled()

  abstract valid()

  abstract back()

  abstract next()

  previous() {
    this.markPreviousWizardStep()
  }

  markNextWizardStep() {
    this.wizardStep++
  }

  markPreviousWizardStep() {
    this.wizardStep--
    if (this.wizardStep == 0) {
      this.wizardStep = 1
    }
  }

  finish() {
    this.formModel.enable()
    this.clearForm()
    this.wizardStep = 1
  }

  clearForm() {
    this.formModel.reset()
  }

  abstract getWizardStepsCount()

  isStepVisible(step) {
    return this.wizardStep == step
  }

  isBackAllowed() {
    return this.wizardStep == 1
  }

  isPreviousAllowed() {
    return this.wizardStep > 1 && this.wizardStep < this.wizardStepsCount
  }

  isNextAllowed() {
    return this.wizardStep < this.wizardStepsCount
  }

  isFinishAllowed() {
    return this.wizardStep == this.wizardStepsCount
  }
}
