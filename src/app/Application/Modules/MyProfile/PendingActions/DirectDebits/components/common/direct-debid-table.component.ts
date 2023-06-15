import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { Subscription } from 'rxjs'
import { DirectDebitsService } from '../../direct-debits.service'

@Component({
  selector: 'app-direct-debits-table',
  templateUrl: './direct-debits-table.component.html',
})
export class DirectDebidTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnDestroy
{
  @Output()
  onDetail: EventEmitter<string> = new EventEmitter()

  @ViewChild('singleTable', { static: true }) singleTable: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []
  selectedSubscription: Subscription

  constructor(
    public translate: TranslateService,
    public service: DirectDebitsService,
  ) {
    super()
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.selectedSubscription = this.service.getSingleSelected.subscribe(
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

  openModal(
    row,
    popup: { openModal: { (arg0: any): void; (arg0: any): void } },
  ) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  detail(item) {
    this.onDetail.emit(item)
  }

  onCustomInnerSelect({ selected }) {
    this.selectAllOnPage[this.singleTable.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setSingleSelected(this.tableSelectedRows)
    // console.log('-----------SELECT SINGLE');
    // console.log(this.tableSelectedRows);
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.singleTable.offset]) {
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
      this.selectAllOnPage[this.singleTable.offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelectedRows);
    } else {
      // Unselect all
      this.items.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.singleTable.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelectedRows);
    }
    this.service.setSingleSelected(this.tableSelectedRows)
    // console.log('-----------SELECT ALL');
    // console.log(this.tableSelectedRows);
  }
}
