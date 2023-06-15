import { Component, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-debit-card-stop-form',
  templateUrl: './debit-card-stop-form.component.html',
})
export class DebitCardStopFormComponent {
  @Input() formModel: any
  @Input() card: any

  reasonList: any[] = [
    {
      reason: 'accounts.debitCards.cardLost',
      value: '01',
    },
    {
      reason: 'accounts.debitCards.cardStolen',
      value: '02',
    },
  ]

  constructor(public translate: TranslateService) {}
}
