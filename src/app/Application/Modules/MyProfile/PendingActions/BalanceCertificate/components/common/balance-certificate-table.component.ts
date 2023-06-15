import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { DatatableComponent } from '@swimlane/ngx-datatable'

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-certificate-table.component.html',
})
export class BalanceCertificateTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []

  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    if (this.selected.length > 0) {
      this.tableSelectedRows = this.selected
    }
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
  onCustomInnerSelect({ selected }) {
    // console.log('Inner select',event);

    this.selectAllOnPage[this.table.offset] = false
    // this.tableSelectedRows.splice(0, this.tableSelectedRows.length);
    // this.tableSelectedRows.push(...selected);
    this.tableSelectedRows = selected
    if (this.externalPagination) {
      this.onSelect.emit(this.tableSelectedRows)
    }
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.table.offset]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.items.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.items)
      this.selectAllOnPage[this.table.offset] = true
    } else {
      // Unselect all
      this.items.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.table.offset] = false
    }
    if (this.externalPagination) {
      this.onSelect.emit(this.tableSelectedRows)
    }
  }
}
