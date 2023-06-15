import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-new-soft-token-step1',
  templateUrl: './new-soft-token-step1.component.html',
  styleUrls: ['./new-soft-token.component.scss'],
})
export class NewSoftTokenStep1Component implements OnInit, OnDestroy {

  /**
   * Form group to the request form
   */
  @Input() form: any

  /**
   * List of debit accounts to the request of soft token
   */
  @Input() accounts: any

   /**
   * Subscriptions array
   */
  subscriptions: Subscription[] = []

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

}
