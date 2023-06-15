import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-duplicate-payrollFile',
  templateUrl: 'duplicate-payrollFile.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class DuplicatePayrollFileComponent
  extends DataTableWraperComponent
  implements OnInit {
  @ViewChild('uploadFilePageTable', { static: true }) table: any

  @Input() duplicateData: any
  tableDisplaySize = 10
  @Input() payroll: boolean = true;
  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit() {
    this.items = this.duplicateData
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }
}
