import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-request-step2',
  templateUrl: './add-request-step2.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() datos: any
  @Input() types: any
  @Input() cities: any
  @Input() accounts: any

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

  isFirstForm() {
    return false //(this.form.controls['requestType'].value =="001");
  }
}
