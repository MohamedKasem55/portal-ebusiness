import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-debit-card-change-pin-step1',
  templateUrl: './debit-card-change-pin-step1.component.html',
})
export class DebitCardChangePinStep1Component implements OnInit {
  @Input() formModel: any
  @Input() card: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.formModel.enable()
  }
}
