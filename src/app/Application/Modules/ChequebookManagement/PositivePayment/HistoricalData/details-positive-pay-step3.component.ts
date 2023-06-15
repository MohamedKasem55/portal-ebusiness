import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-details-positive-pay-step3',
  templateUrl: 'details-positive-pay-step3.component.html',
})
export class DetailsPositivePayStep3Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @Input() generateChallengeAndOTP: any
  @Input() positivePayDetails: any

  constructor() {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  isPending() {
    return false
  }
}
