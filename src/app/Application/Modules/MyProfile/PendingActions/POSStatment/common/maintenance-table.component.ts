import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-maintenance-table',
  templateUrl: './maintenance-table.component.html',
})
export class MaintenanceTableComponent
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
