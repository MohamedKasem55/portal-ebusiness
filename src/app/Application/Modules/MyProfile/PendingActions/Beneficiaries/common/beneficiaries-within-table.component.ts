import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-beneficiaries-within-table',
  templateUrl: './beneficiaries-within-table.component.html',
})
export class BeneficiariesWithinTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
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
