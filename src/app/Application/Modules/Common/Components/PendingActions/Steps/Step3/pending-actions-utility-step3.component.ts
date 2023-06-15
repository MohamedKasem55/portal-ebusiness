import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-pending-actions-utility-step3',
  templateUrl: './pending-actions-utility-step3.component.html',
})
export class PendingActionsUtilityStep3Component {
  @Input() pending = true
}
