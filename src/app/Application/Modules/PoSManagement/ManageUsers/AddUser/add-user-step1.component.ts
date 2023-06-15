import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-user-step1',
  templateUrl: './add-user-step1.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserStep1Component implements OnInit, OnDestroy {
  @Input() selectedUser: any

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
