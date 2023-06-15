import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-moi-refund-form',
  templateUrl: './moi-refund-form.component.html',
})
export class MoiRefundFormComponent implements OnInit, OnDestroy {
  @Input() formModel: any

  @Input() combosData: any

  @Input() fieldsConfigs: any[]

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onChangeServiceType() {
    this.formModel.controls['applicationType'].value = ''
  }

  getFieldErrorsAsArray(fieldKey: any = null) {
    if (!this.formModel.get(fieldKey) || !this.formModel.get(fieldKey).errors) {
      return []
    }
    const errors = this.formModel.get(fieldKey).errors
    const keys = Object.keys(errors)
    const errorsArray = []
    for (let i = 0; i < keys.length; i++) {
      errorsArray.push({
        code: keys[i],
        params: {
          size:
            typeof errors[keys[i]] == 'object'
              ? errors[keys[i]].requiredLength
              : '',
        },
      })
    }
    return errorsArray
  }
}
