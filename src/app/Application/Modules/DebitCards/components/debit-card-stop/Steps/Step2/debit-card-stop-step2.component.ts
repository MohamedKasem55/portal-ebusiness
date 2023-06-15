import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-debit-card-stop-step2',
  templateUrl: './debit-card-stop-step2.component.html',
})
export class DebitCardStopStep2Component implements OnInit {
  @Input() formModel: any
  @Input() card: any

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.formModel.disable()
  }
}
