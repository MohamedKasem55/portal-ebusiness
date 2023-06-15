import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-transfer-international-table',
  templateUrl: './transfer-international-table.component.html',
})
export class TransferInternationalTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input('showRate') showRate = false

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
