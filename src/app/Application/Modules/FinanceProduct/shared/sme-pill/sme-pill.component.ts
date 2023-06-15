import { Component, Input, OnChanges } from '@angular/core'
import { Pill } from 'app/Application/Modules/FinanceProduct/shared/models/common'

@Component({
  selector: 'sme-pill',
  templateUrl: './sme-pill.component.html',
  styleUrls: ['./sme-pill.component.scss'],
})
export class SmePillComponent implements OnChanges {
  /*types of PillStatus = { default, warning, primary }*/

  @Input() pill: Pill = { txt: '', status: 'default' }
  className = `sme-pills-${this.pill.status}`
  constructor() {}
  ngOnChanges() {
    this.className = `sme-pills-${this.pill.status}`
  }
}
