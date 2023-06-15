import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-credit-cards-details-payments-in-advance-step2',
  templateUrl:
    './credit-cards-details-payments-in-advance-step2.component.html',
})
export class CreditCardsDetailsPaymentsInAdvanceStep2Component
  implements OnInit, OnDestroy
{
  @Input() formModel: any
  @Input() card: any
  @Input() paymentData: any
  @Input() accountList: any[]

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.formModel.disable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
