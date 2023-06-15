import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-moi-refund-step1',
  templateUrl: './moi-refund-step1.component.html',
})
export class MoiRefundStep1Component implements OnInit, OnDestroy {
  @Input() formModel: any

  @Input() combosData: any

  @Input() fieldsConfigs: any[]

  subscriptions: Subscription[] = []

  @Input() preparedData: any[]

  @Output() addRefund = new EventEmitter<any>()

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.formModel.enable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onAddRefund() {
    this.addRefund.emit(true)
  }

  onResetRefund() {
    this.addRefund.emit(false)
  }

  removePreparedData(i) {
    const removed = this.preparedData.splice(i, 1)
  }

  getServiceTypeText(value) {
    let text = value
    this.combosData['eGovSadadRType']
      .filter((item) => item.key == value)
      .forEach((item) => {
        text = item.value
      })
    return text
  }

  getApplicationTypeText(st, value) {
    let text = value
    const transactionCombo =
      this.combosData['applicationsTypesAllCombosKey'][st]
    this.combosData[transactionCombo]
      .filter((item) => item.key == value)
      .forEach((item) => {
        text = item.value
      })
    return text
  }

  getAccountText(value) {
    let text = value
    this.combosData['accounts']
      .filter((item) => item.fullAccountNumber == value)
      .forEach((item) => {
        text = item.fullAccountNumber
        //+ (item.alias != '' ? ' - ' + item.alias : '')
        //+' '+(item.inquiry ? (' - ' + item.availableBalance +' '+ item.currency) : '')
      })
    return text
  }
}
