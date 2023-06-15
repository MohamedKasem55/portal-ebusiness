import { Component, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-debit-card-change-pin-form',
  templateUrl: './debit-card-change-pin-form.component.html',
})
export class DebitCardChangePinFormComponent {
  @Input() formModel: any
  @Input() card: any

  sameOldAndNewPin: boolean = false

  constructor(public translate: TranslateService) {}
}
