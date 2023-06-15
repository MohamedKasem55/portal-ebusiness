import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-payroll-table',
  templateUrl: './payroll-table.component.html',
})
export class PayrollTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input() billCodes

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
