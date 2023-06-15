import { ValidatorFn } from '@angular/forms'

export class EntityPropertyConfig {
  key: string
  title: any
  translate: string
  type: string
  required: boolean
  default: string
  validators: ValidatorFn[]
  widget: string
  widget_container_class: string
  widget_container_init_row: boolean
  widget_container_end_row: boolean
  updatable: boolean
  isFormField: boolean
  isForValidate: boolean
  isForConfirm: boolean

  constructor(
    strName: string,
    strTitle: string,
    strTranslate: string,
    strType: string,
    required: boolean,
    strDefault: string,
    pValidators: ValidatorFn[],
    strWidget: string,
    pWidgetContainerClass: string,
    pWidgetInitRow: boolean,
    pWidgetEndRow: boolean,
    pUpdatable: boolean,
    pIsFormField: boolean,
    pIsForvalidate: boolean,
    pIsForConfirm: boolean,
  ) {
    this.key = strName
    this.title = strTitle
    this.translate = strTranslate
    this.type = strType
    this.required = required
    this.default = strDefault
    this.validators = pValidators
    this.widget = strWidget
    this.widget_container_class = pWidgetContainerClass
    this.widget_container_init_row = pWidgetInitRow
    this.widget_container_end_row = pWidgetEndRow
    this.updatable = pUpdatable
    this.isFormField = pIsFormField
    this.isForValidate = pIsForvalidate
    this.isForConfirm = pIsForConfirm
  }
}
