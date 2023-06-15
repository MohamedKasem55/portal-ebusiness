import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
  selector: 'app-commercialCards-table',
  templateUrl: './commercial-cards-table.component.html',
})
export class CommercialCardsTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
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
