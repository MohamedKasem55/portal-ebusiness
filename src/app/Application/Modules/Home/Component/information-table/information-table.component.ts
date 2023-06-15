import { Component, Input, OnChanges } from '@angular/core'
import { TableRow } from '../../information/utils/table-row.interface'

@Component({
  templateUrl: 'information-table.component.html',
  styleUrls: ['information-table.component.scss'],
  selector: 'app-information-table',
})
export class InformationTableComponent implements OnChanges {
  @Input() tableData: TableRow[]

  public filteredTableData: TableRow[] = []

  public ngOnChanges() {
    this.filteredTableData = this._filteredTableData()
  }

  private _filteredTableData(): TableRow[] {
    const filteredTable: TableRow[] = []
    if (!this.tableData) {
      return filteredTable
    }
    this.tableData.forEach((row) => {
      if (row.haveToShow) {
        filteredTable.push(row)
      }
    })
    return filteredTable
  }
}
