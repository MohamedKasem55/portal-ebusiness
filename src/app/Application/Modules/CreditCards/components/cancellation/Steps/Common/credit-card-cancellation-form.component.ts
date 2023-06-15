import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-credit-card-cancellation-form',
  templateUrl: './credit-card-cancellation-form.component.html',
})
export class CreditCardCancellationFormComponent implements OnInit, OnDestroy {
  @Input() formModel: any

  @Input() cards: any[]

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
