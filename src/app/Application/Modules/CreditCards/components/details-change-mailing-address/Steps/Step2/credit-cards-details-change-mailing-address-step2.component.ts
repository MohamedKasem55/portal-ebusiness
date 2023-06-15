import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-credit-cards-details-change-mailing-address-step2',
  templateUrl:
    './credit-cards-details-change-mailing-address-step2.component.html',
})
export class CreditCardsDetailsChangeMailingAddressStep2Component
  implements OnInit, OnDestroy
{
  @Input() formModel: any

  @Input() card: any

  @Input() inquiryMailingData: any

  @Input() combosData: any

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
