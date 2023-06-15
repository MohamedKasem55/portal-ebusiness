import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-transfer-local-table',
  templateUrl: './transfer-local-table.component.html',
})
export class TransferLocalTableComponent
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
