import { EventEmitter, Input, OnInit, Output, Directive } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { AbstractWizardComponent } from '../abstract-wizard.component'
import { AbstractInitiatorService } from '../../../Services/Abstract/abstract-initiator-service'
import { StaticService } from '../../../Services/static.service'

@Directive()
export abstract class AbstractWizardInitiatorComponent
  extends AbstractWizardComponent
  implements OnInit
{
  @Input() entityProperties: any[]
  @Input() currentItem: any = {}
  @Input() title: string
  @Input() entityName: string
  @Input() translate_prefix: string
  @Input() combosKeys: any
  @Input() combosData: any
  @Input() service: AbstractInitiatorService
  @Input() backUrl: string
  @Input() custom_fields_templates: any = {}

  @Output() onAllFieldsCreated: EventEmitter<any> = new EventEmitter<any>()
  @Output() onInitFormFieldsUtility: EventEmitter<any> = new EventEmitter<any>()
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>()
  @Output() onFinish: EventEmitter<any> = new EventEmitter<any>()
  @Input() pending = false

  existError = false

  formEntityProperties: any[]

  abstract onInitStep(step: any, events: any)

  abstract isDisabled()

  abstract valid()

  abstract back()

  abstract next()

  getWizardStepsCount() {
    throw new Error('Method not implemented.')
  }

  protected abstract initiateItem()

  protected constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.wizardStep = 1
    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()
    if (this.entityProperties) {
      this.formEntityProperties = this.entityProperties.filter(
        (element) => element.isFormField,
      )
    }
    //this.formModel = this.fb.group(auxFormCreator);
  }

  staticRecoverValues(combos, data, label) {
    const auxData = []
    const index = Object.keys(data[combos.indexOf(label)]['values']).sort(
      (a, b) =>
        data[combos.indexOf(label)]['values'][a] >
        data[combos.indexOf(label)]['values'][b]
          ? 1
          : data[combos.indexOf(label)]['values'][b] >
            data[combos.indexOf(label)]['values'][a]
          ? -1
          : 0,
    )

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < index.length; i++) {
      auxData.push({
        key: index[i],
        value: data[combos.indexOf(label)]['values'][index[i]],
      })
    }

    return auxData
  }

  allFieldsCreated($event) {
    this.onAllFieldsCreated.emit($event)
  }

  initFormFieldsUtility($event) {
    this.onInitFormFieldsUtility.emit($event)
  }

  finish() {
    this.formModel.enable()
    this.clearForm()
    this.wizardStep = 1
    this.onFinish.emit({ postData: this.validationResponse })
  }
}
