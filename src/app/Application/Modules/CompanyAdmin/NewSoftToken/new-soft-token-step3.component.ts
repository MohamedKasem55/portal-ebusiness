import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-new-soft-token-step3',
  templateUrl: './new-soft-token-step3.component.html',
  styleUrls: ['./new-soft-token.component.scss'],
})
export class NewSoftTokenStep3Component {
  error=false

  /**
   * Flag: true if company is dual authorization false if not
   */
  @Input() isDual:boolean
}
