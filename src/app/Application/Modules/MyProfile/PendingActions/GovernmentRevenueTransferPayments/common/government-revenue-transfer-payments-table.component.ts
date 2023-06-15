import { Component, EventEmitter, Input, OnInit, Output, Injector} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-government-revenue-transfer-payments-table',
  templateUrl: './government-revenue-transfer-payments-table.component.html',
})
export class GovernmentRevenueTransferPaymentsTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input() tableDisplaySize = 20

  @Output()
  onDetail: EventEmitter<string> = new EventEmitter()

  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  detail(item) {
    this.onDetail.emit(item)
  }

  public parseDate(
    actualValue: any,
    actualDataKey: string,
    row: any,
    injector: Injector,
    locale,
  ): any {
    if (actualValue && actualValue != '') {
      return injector.get(DatePipe).transform(actualValue, 'dd/MM/yyyy')
    }
  }
}
