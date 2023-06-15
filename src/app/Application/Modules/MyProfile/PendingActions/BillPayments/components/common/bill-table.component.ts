import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { BillPaymentsService } from '../../bill-payments.service'

@Component({
  selector: 'app-bill-table',
  templateUrl: './bill-table.component.html',
})
export class BillTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input() billCodes
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []

  constructor(
    public translate: TranslateService,
    public service: BillPaymentsService,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.service.billsSelected.subscribe((bills) => {
      if (bills.length == 0) {
        this.selectAllOnPage = []
      }
    })
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  getBillCodeLiteral(code) {
    if (!this.billCodes) return

    for (let i = this.billCodes.length - 1; i >= 0; i--) {
      if (this.billCodes[i].billCode == code) {
        if (this.translate.currentLang == 'en') {
          return this.billCodes[i].addDescriptionEn
        } else {
          return this.billCodes[i].addDescriptionAr
        }
      }
    }
    return code
  }

  onCustomInnerSelect({ selected }) {
    // Make sure we are no longer selecting all
    // console.log('---select one---');
    this.selectAllOnPage[this.table.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setBillPaymentsSelected([])
    this.service.setBillSelected(this.tableSelectedRows)
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

    this.service.setBillPaymentsSelected([])
    this.service.setBillSelected(this.tableSelectedRows)
  }
}
