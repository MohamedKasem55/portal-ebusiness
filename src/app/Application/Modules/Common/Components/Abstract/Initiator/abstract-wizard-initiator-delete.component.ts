import { OnInit, Directive } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractWizardInitiatorComponent } from './abstract-wizard-initiator.component'

@Directive()
export abstract class AbstractWizardInitiatorDeleteComponent
  extends AbstractWizardInitiatorComponent
  implements OnInit
{
  next() {
    switch (this.wizardStep) {
      case 1: {
        this.initiateItem()
        this.service.validate(this.currentItem).subscribe((result) => {
          if (result && result.errorCode) {
            if (+result.errorCode === 0) {
              this.validationResponse =
                this.entityName && result[this.entityName.toString()]
                  ? result[this.entityName.toString()]
                  : Object.assign({}, this.currentItem)
              this.service
                .confirm(this.validationResponse)
                .subscribe((resultValidate) => {
                  if (resultValidate && resultValidate.errorCode) {
                    if (+resultValidate.errorCode === 0) {
                      this.markNextWizardStep()
                      this.existError = false
                    } else {
                      this.onError(resultValidate)
                    }
                  }
                })
            } else {
              this.existError = true
              this.validationResponse = {}
              this.onError(result)
              //this.previous();
            }
          }
        })
        break
      }
      case 2: {
        this.back()
        break
      }
    }
  }

  getWizardStepsCount() {
    return 2
  }

  protected initiateItem() {
    this.entityProperties.forEach((element) => {
      this.currentItem[element.key.toString()] =
        this.currentItem[element.key.toString()]
    })
  }

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
    this.entityProperties.forEach((element) => {
      this.formModel.controls[element.key.toString()].setValue(
        this.currentItem[element.key.toString()],
      )
    })
    this.formModel.disable()
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
