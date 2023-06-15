import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-balance-certificate-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @Input() model: any
  @Input() cities: any
  @Input() city: any
  @Input() accounts: any
  @Output() onInit = new EventEmitter<Component>()

  subscriptions: Subscription[] = []

  constructor() {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
