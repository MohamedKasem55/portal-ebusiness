import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-moi-payment-refund-batch-list',
  templateUrl: './moi-payment-refund-batch-list.component.html',
})
export class MoiPaymentRefundBatchListComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input('moiTypeText') moiTypeText = null

  @Input('actionText') actionText = null

  @Input('applicationTypePipe') applicationTypePipe = null

  @Input('serviceTypePipe') serviceTypePipe = null

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
}
