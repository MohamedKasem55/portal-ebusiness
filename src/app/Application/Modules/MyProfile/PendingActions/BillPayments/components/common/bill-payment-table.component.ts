import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { BillPaymentsService } from '../../bill-payments.service'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-billpayment-table',
  templateUrl: './bill-payment-table.component.html',
})
export class BillPaymentTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
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
    this.service.billPaymentsSelected.subscribe((billsPayments) => {
      if (billsPayments.length == 0) {
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

  onCustomInnerSelect({ selected }) {
    // Make sure we are no longer selecting all
    // console.log('---select one---');
    this.selectAllOnPage[this.table.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setBillSelected([])
    this.service.setBillPaymentsSelected(this.tableSelectedRows)
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
    // console.log(this.tableSelectedRows)
    this.service.setBillSelected([])
    this.service.setBillPaymentsSelected(this.tableSelectedRows)
  }
}
