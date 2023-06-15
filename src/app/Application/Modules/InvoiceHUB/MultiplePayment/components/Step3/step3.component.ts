import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { MultiPaymentService } from '../../multi-payment.service'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('authorization', { static: true }) authorization: any
  @ViewChild('invoiceTable', { static: true }) table: any

  step = 3
  sharedData: any = {}

  subscriptions: Subscription[]
  pageSize = 10
  totalAmount = 0

  futureLevels: false

  constructor(
    private service: MultiPaymentService,
    public translate: TranslateService,
    private router: Router,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    const balance = this.sharedData.account.availableBalance
    for (let i = 0; i < this.sharedData.tableSelectedRows.length; i++) {
      this.sharedData.tableSelectedRows[i]['balance'] = balance
      this.sharedData.tableSelectedRows[i]['note'] =
        this.translate.currentLang === 'en'
          ? this.sharedData.tableSelectedRows[i].additionalDetails
          : this.sharedData.tableSelectedRows[i].additionalDetailsAr
      this.totalAmount =
        this.totalAmount +
        Number(this.sharedData.tableSelectedRows[i]['amountPayment'])
    }
    this.translate.onLangChange.subscribe(
      function (event: LangChangeEvent) {
        for (
          let j = 0;
          j < this.sharedData.tableSelectedRows.length.length;
          j++
        ) {
          this.sharedData.tableSelectedRows[j]['note'] =
            this.translate.currentLang === 'en'
              ? this.sharedData.tableSelectedRows[j].additionalDetails
              : this.sharedData.tableSelectedRows[j].additionalDetailsAr
        }
      }.bind(this),
    )
    /*if (Object.keys(this.sharedData).length === 0) {
            this.router.navigate(['/invoiceHUB/multi-payment/step1']);
        }*/
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return this.authorization.valid()
    }
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
