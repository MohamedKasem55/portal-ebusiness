import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { InvoiceHUBService } from '../invoiceHUB.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-invoiceHUB-table',
  templateUrl: './invoiceHUB-table.html',
})
export class InvoiceHUBTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []
  selectedSubscription: Subscription

  constructor(
    public translate: TranslateService,
    public service: InvoiceHUBService,
  ) {
    super()
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }
  ngOnInit(): void {
    super.ngOnInit()
    //console.log(this.items);

    if (!(this.items instanceof PagedData)) {
      const pageResult = new PagedData()

      const page = new Page()
      pageResult.data = this.items
      page.totalElements = this.items.length
      page.size =
        pageResult.data.length > page.pageSize
          ? page.pageSize
          : pageResult.data.length
      page.totalPages = page.totalElements / page.pageSize
      pageResult.page = page
      this.items = pageResult
      //console.log(this.items);
    }

    this.selectedSubscription = this.service.getSelected.subscribe(
      (selected) => {
        if (selected.length == 0) {
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

  setPageSize(event) {
    super.onChangeSize(event)
    this.items.page.pageNumber = 0
    this.table.offset = 0
    this.table.recalculate()
  }

  onCustomInnerSelect({ selected }) {
    // console.log('Inner select',event);
    this.selectAllOnPage[this.table.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setSelected(this.tableSelectedRows)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.table.offset]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.items.data.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.items.data)
      this.selectAllOnPage[this.table.offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelectedRows);
    } else {
      // Unselect all
      this.items.data.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.table.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelectedRows);
    }
    this.service.setSelected(this.tableSelectedRows)
  }
}
