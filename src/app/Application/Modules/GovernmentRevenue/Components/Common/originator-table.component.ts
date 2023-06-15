import { Component, Input } from '@angular/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import {
  DepositorOriginator,
  OriginatorType,
} from '../../Model/depositor-originator'

@Component({
  selector: 'app-originator-table',
  templateUrl: './originator-table.component.html',
})
export class OriginatorTableComponent extends DatatableMobileComponent {
  @Input() originator: DepositorOriginator
  @Input() showName = false
  @Input() type: OriginatorType = OriginatorType.BENEFICIARY
  OriginatorType = OriginatorType

  getOriginator(): any[] {
    if (this.originator) {
      return [this.originator]
    }
    return []
  }
}
