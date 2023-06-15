import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { Subscription } from 'rxjs'
import { StandingOrdersService } from '../standing-orders.service'

@Component({
  selector: 'app-standing-order-table',
  templateUrl: './standing-order-table.component.html',
})
export class StandingOrderTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnDestroy
{
  @Input() step = 0
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []
  selectedSubscription: Subscription

  constructor(
    public translate: TranslateService,
    public service: StandingOrdersService,
  ) {
    super()
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.selectedSubscription = this.service.getTableSelected.subscribe(
      (selected) => {
        if (selected.length == 0) {
          this.selectAllOnPage = []
        }
      },
    )
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
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setTableSelected(this.tableSelectedRows)

    // console.log(this.tableSelectedRows);
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
      // console.log('-----------Select All----');
      // console.log(this.tableSelectedRows);
    } else {
      // Unselect all
      this.items.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.table.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelectedRows);
    }
    this.service.setTableSelected(this.tableSelectedRows)
    // console.log(this.tableSelectedRows);
  }
}
