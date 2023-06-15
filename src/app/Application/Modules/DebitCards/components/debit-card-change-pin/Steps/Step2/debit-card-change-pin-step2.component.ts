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
  selector: 'app-debit-card-change-pin-step2',
  templateUrl: './debit-card-change-pin-step2.component.html',
})
export class DebitCardChangePinStep2Component implements OnInit, OnDestroy {
  @Input() formModel: any
  @Input() card: any
  @Output() onInit = new EventEmitter<Component>()

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.formModel.disable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
