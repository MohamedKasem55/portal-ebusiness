import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-nonFinancial-table',
  templateUrl: './nonFinancial-workflow-table.component.html',
})
export class NonFinancialWorkflowTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.collapseAll()
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  isRowChildContentExpanded(row) {
    return row['expandedChildContent']
  }

  collapseAll() {
    this.items.forEach(element => {
      element['expandedChildContent'] = false
    });
    if (this.table && this.table.rowDetail && !this.mobile) { this.table.rowDetail.collapseAllRows() }
  }

  showOrHideChildContent(row) {
    const state = row.expandedChildContent
    this.collapseAll()
    row.expandedChildContent = !state
    if (row.expandedChildContent && this.table && this.table.rowDetail && !this.mobile) { this.table.rowDetail.toggleExpandRow(row) }
  }

  onAllTablesResized() {
    console.log('onAllTablesResized');
    this.items.forEach(row => {
      if (row['expandedChildContent']) {
        row['expandedChildContent'] = false
        this.showOrHideChildContent(row)
      }
    });
  }


}
