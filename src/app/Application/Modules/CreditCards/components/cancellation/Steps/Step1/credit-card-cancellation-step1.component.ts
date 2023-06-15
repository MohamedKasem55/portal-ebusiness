import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-credit-card-cancellation-step1',
  templateUrl: './credit-card-cancellation-step1.component.html',
})
export class CreditCardCancellationStep1Component implements OnInit, OnDestroy {
  @Input() formModel: any

  @Input() cards: any[]

  subscriptions: Subscription[] = []

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
}
