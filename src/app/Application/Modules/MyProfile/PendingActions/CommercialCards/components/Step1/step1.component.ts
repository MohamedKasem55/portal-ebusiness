import { Component, OnInit, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { CommercialCardsService } from '../../commercial-cards.service'
import { LevelFormatPipe } from 'app/Application/Components/common/Pipes/getLevels-pipe'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}

  pendingSubscriptions: Subscription
  businessCardsResults: any = {}
  tableDisplaySize = 20

  constructor(
    private service: CommercialCardsService,
    public translate: TranslateService,
    private injector: Injector,
  ) {}
  ngOnInit(): void {
    this.businessCardsResults.items = []
    this.businessCardsResults.size = 0
    this.businessCardsResults.total = 0

    this.sharedData.tableSelected = []

    // Llamada al Activate Option

    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.pendingSubscriptions = this.service
      .getPending(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.businessCardsResults = result.businessCardPaymentsPagedResults
          this.processItemsLevels(this.businessCardsResults.items)
        }
        this.pendingSubscriptions.unsubscribe()
      })
  }

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.sharedData.tableSelected.splice(
      0,
      this.sharedData.tableSelected.length,
    )
    this.sharedData.tableSelected.push(...selected)
    //console.log(this.sharedData);
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['currencyCode'] = item.currency
        if (item.securityLevelsDTOList) {
          item['curStatusExport'] = new LevelFormatPipe(
            this.injector,
          ).transform(item.securityLevelsDTOList, 'status')
          item['nextStatusExport'] = new LevelFormatPipe(
            this.injector,
          ).transform(item.securityLevelsDTOList, 'nextStatus')
        }
      })
    }
  }

  mockPABusinessCards(): any[] {
    const response = [
      {
        initiationDate: new Date(),
        cardId: '1234123412341234',
        type: 'T',
        paymentOption: 'P',
        amount: 123,
        //extra features
        accountAlias: 'alias',
        accountNumber: '040330010006080010140',
        batchPk: 76437,
        amountPay: '123',
        nextStatus: null,
        hostRequest: null,
        futureSecurityLevelsDTOList: null,
        futureStatus: 'NOT_ALLOWED',
        pdfSecurityLevelsDTOList: [
          {
            auditStatus: null,
            batchSecurityPk: null,
            level: 1,
            pdfStatus: null,
            status: 'I',
            updateDate: '2020-07-20',
            updater: 'usertest23',
            userPk: null,
          },
        ],
        rejectedReason: null,
        securityLevelsDTOList: [
          {
            auditStatus: null,
            batchSecurityPk: null,
            level: 1,
            pdfStatus: null,
            status: 'I',
            updateDate: '2020-07-20',
            updater: 'usertest23',
            userPk: null,
          },
          {
            auditStatus: null,
            batchSecurityPk: null,
            level: 2,
            pdfStatus: null,
            status: 'P',
            updateDate: null,
            updater: null,
            userPk: null,
          },
        ],
        status: 'P',
      },
    ]
    return response
  }
}
