import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { DataTableWraperComponent } from 'app/Application/Components/common/data-table-wrapper.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-prepaid-cards-table',
  templateUrl: './prepaid-cards-table.component.html',
})
export class PrepaidCardsTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @Input() paymentMode = true
  @Input() title: string

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
