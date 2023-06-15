import { OnInit, Directive } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractWizardInitiatorComponent } from './abstract-wizard-initiator.component'

@Directive()
export abstract class AbstractWizardInitiatorAddComponent
  extends AbstractWizardInitiatorComponent
  implements OnInit
{
  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    translate: TranslateService,
    router: Router,
  ) {
    super(fb, staticService, translate, router)
  }

  ngOnInit() {
    super.ngOnInit()
    /*this.entityProperties.forEach((element) => {
            if (element.isFormField) {
                this.formModel.controls[element.key.toString()].setValue(
                    null
                );
            }
        });*/
  }

  next() {
    switch (this.wizardStep) {
      case 1: {
        this.initiateItem()
        this.service.validate(this.currentItem).subscribe((result) => {
          if (result && result.errorCode) {
            if (+result.errorCode === 0) {
              this.markNextWizardStep()
              this.existError = false
              this.formModel.disable({ emitEvent: false })
              this.validationResponse =
                this.entityName && result[this.entityName.toString()]
                  ? result[this.entityName.toString()]
                  : Object.assign({}, this.currentItem)
            } else {
              this.existError = true
              this.validationResponse = {}
              this.onError(result)
              this.previous()
            }
          }
        })
        break
      }
      case 2: {
        this.service.confirm(this.validationResponse).subscribe((result) => {
          if (result && result.errorCode) {
            if (+result.errorCode === 0) {
              this.markNextWizardStep()
              this.existError = false
            } else {
              this.onError(result)
            }
          }
        })
        break
      }
      case 3:
        this.back()
        break
    }
  }

  getWizardStepsCount() {
    return 3
  }

  previous() {
    super.previous()
    this.formModel.enable()
  }

  protected initiateItem() {
    this.entityProperties.forEach((element) => {
      if (element.isFormField) {
        this.currentItem[element.key.toString()] =
          this.formModel.controls[element.key.toString()].value
      } else {
        this.currentItem[element.key.toString()] = null
      }
    })
  }

  back() {
    this.finish()
    this.currentItem = {}
    this.service.back(this.backUrl)
  }

  onInitStep(step: any, events: any) {
    throw new Error('Method not implemented.')
  }

  valid() {
    throw new Error('Method not implemented.')
  }
}
