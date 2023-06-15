import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { BillPaymentsService } from '../../bill-payments.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  @ViewChild('table') table: any

  step = 1
  sharedData: any = {}

  getPendingBillBatchesSubscription: Subscription
  getPendingBillerBatchesSubscription: Subscription

  billsPagedResults: any = {}
  billersPagedResults: any = {}

  tableDisplaySize = 20
  tableBillerDisplaySize = 20

  constructor(
    private service: BillPaymentsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
  ) {}

  getBillCodeLiteral(code) {
    for (let i = this.sharedData.billCodes.length - 1; i >= 0; i--) {
      if (this.sharedData.billCodes[i].billCode == code) {
        if (this.translate.currentLang == 'en') {
          return this.sharedData.billCodes[i].addDescriptionEn
        } else {
          return this.sharedData.billCodes[i].addDescriptionAr
        }
      }
    }
    return code
  }

  ngOnInit(): void {
    this.billsPagedResults.items = []
    this.billsPagedResults.size = 0
    this.billsPagedResults.total = 0

    this.billersPagedResults.items = []
    this.billersPagedResults.size = 0
    this.billersPagedResults.total = 0

    this.sharedData.tableSelected = []
    this.sharedData.tableBillerSelected = []

    this.setPage(null)
    this.setPageBiller(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingBillBatchesSubscription = this.service
      .getPendingBillBatches(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.billsPagedResults = result.billsPagedResults
        }
        this.getPendingBillBatchesSubscription.unsubscribe()
      })

    this.service.billPaymentsSelected.subscribe((billPaymentsSelected) => {
      // console.log('shared- subscription',billPaymentsSelected);
      this.sharedData.tableSelected = billPaymentsSelected
    })
    this.service.billsSelected.subscribe((billSelected) => {
      // console.log('shared bill- subscription',billSelected);
      this.sharedData.tableBillerSelected = billSelected
    })
  }

  setPageBiller(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingBillerBatchesSubscription = this.service
      .getPendingBillerBatches(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.billersPagedResults = result.billsPagedResults
        }
        this.getPendingBillerBatchesSubscription.unsubscribe()
      })
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }
  changeDisplaySizeBiller(event) {
    this.tableBillerDisplaySize = event
    this.setPageBiller(null)
  }
}
