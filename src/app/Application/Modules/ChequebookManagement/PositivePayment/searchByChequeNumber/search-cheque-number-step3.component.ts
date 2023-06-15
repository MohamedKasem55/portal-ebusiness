import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-search-cheque-number-step3',
  templateUrl: 'search-cheque-number-step3.component.html',
})
export class SearchByChequeNumberStep3Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @Input() generateChallengeAndOTP: any

  @Input() positivePayResult: any = {}

  constructor() {
    super()
  }

  ngOnInit() {
    if (
      this.positivePayResult &&
      typeof this.positivePayResult != 'undefined' &&
      this.positivePayResult.positivePayCheck &&
      typeof this.positivePayResult.positivePayCheck != 'undefined' &&
      this.positivePayResult.positivePayCheck.positivePayCheckAccountsOutDTO &&
      this.positivePayResult.positivePayCheck.positivePayCheckAccountsOutDTO !=
        'undefined'
    ) {
      for (const positivePayResult of this.positivePayResult.positivePayCheck
        .positivePayCheckAccountsOutDTO) {
        positivePayResult['accountNumber'] =
          this.positivePayResult.accountNumber
      }
    }
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
