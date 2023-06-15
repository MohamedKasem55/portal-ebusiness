import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-transfer-within-table',
  templateUrl: './transfer-within-table.component.html',
})
export class TransferWithinTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input('actionText') actionText = null

  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
