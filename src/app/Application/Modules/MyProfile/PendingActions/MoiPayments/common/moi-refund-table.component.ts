import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'
import { LevelFormatPipe } from '../../../../../Components/common/Pipes/getLevels-pipe'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { MoiPaymentsService } from '../moi-payments.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-moi-refund-table',
  templateUrl: './moi-refund-table.component.html',
})
export class MoiRefundTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() showCitizenId = false
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []
  refundsSelectedSubscription: Subscription

  constructor(
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
    public service: MoiPaymentsService,
  ) {
    super()
  }

  ngOnDestroy() {
    this.refundsSelectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.refundsSelectedSubscription = this.service.refundsSelected.subscribe(
      (selected) => {
        if (selected.length == 0) {
          this.selectAllOnPage = []
        }
      },
    )
  }

  ngOnChanges() {
    this.prepareItems()
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  private prepareItems() {
    this.items.forEach((item) => {
      const status = this.futureLevels
        ? item.futureSecurityLevelsDTOList
        : item.securityLevelsDTOList
      const nextStatus = status
      item.statusTranslated = this.levelsPipe.transform(status, 'status')
      item.nextStatusTranslated = this.levelsPipe.transform(
        nextStatus,
        'nextStatus',
      )
      item.citizenId = this.getCitizenIdFromDetails(
        item.details ? item.details : [],
      )
    })
  }

  private getCitizenIdFromDetails(details: any[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < details.length; i++) {
      if (
        details[i].labelKey.endsWith('citizenId') ||
        details[i].labelKey.endsWith('sponsorId') ||
        details[i].labelKey.endsWith('iqamaId') ||
        details[i].labelKey.endsWith('nationalIdNumber') ||
        details[i].labelKey.endsWith('violatorId') ||
        details[i].labelKey.endsWith('borderNumber') ||
        details[i].labelKey.endsWith('householdIdNumber') ||
        details[i].labelKey.endsWith('currentOwnerId') ||
        details[i].labelKey.endsWith('newOwnerId')
      ) {
        return details[i].value
      }
    }
    return null
  }

  onCustomInnerSelect({ selected }) {
    // console.log('Inner select',event);
    this.selectAllOnPage[this.table.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setRefundsSelected(this.tableSelectedRows)
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
    this.service.setRefundsSelected(this.tableSelectedRows)
  }

  getNowDate() {
    return new Date()
  }
}
