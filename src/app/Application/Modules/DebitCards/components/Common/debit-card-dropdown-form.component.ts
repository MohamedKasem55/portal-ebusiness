import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-debit-card-dropdown-form',
  templateUrl: './debit-card-dropdown-form.component.html',
})
export class DebitCardDropdownFormComponent implements OnInit, OnDestroy {
  @Input() formModel: any

  @Input() itemList: any[]

  @Input() label: string

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
