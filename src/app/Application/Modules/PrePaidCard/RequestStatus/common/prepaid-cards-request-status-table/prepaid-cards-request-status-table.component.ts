import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-prepaid-cards-request-status-table',
  templateUrl: './prepaid-cards-request-status-table.component.html',
})
export class PrepaidCardsRequestStatusTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input() paymentMode = true
  @Input() title: string

  @Output()
  goActivate = new EventEmitter<any>()

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

  public onActivate(row) {
    this.goActivate.emit(row)
  }
}
