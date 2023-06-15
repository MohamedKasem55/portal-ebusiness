import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MultiPaymentService } from '../../multi-payment.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}
  isSearchCollapsed = true
  bsConfig: any

  constructor(
    private service: MultiPaymentService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.sharedData.searchCriteria = {
      supplierName: null,
      dateTo: null,
      dateFrom: null,
      amountFrom: null,
      amountTo: null,
    }
    this.sharedData['isSearchError'] = false
    this.sharedData.tableSelectedRows = []
  }

  valid() {
    return this.sharedData['payerId'] && this.sharedData['payerId'].length == 12
  }

  reset() {
    this.sharedData.searchCriteria = {
      supplierName: null,
      dateTo: null,
      dateFrom: null,
      amountFrom: null,
      amountTo: null,
    }
    this.sharedData['isSearchError'] = false
    this.sharedData.tableSelectedRows = []
  }
}
