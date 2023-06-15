import { Component, OnInit, Injector, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { PrepaidCardsService } from '../../prepaid-cards.service'
import { TranslateService } from '@ngx-translate/core'
import { LevelFormatPipe } from 'app/Application/Components/common/Pipes/getLevels-pipe'

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  subscriptions: Subscription[] = []
  prepaidCardsResults: any = {}
  replacePrepaidCardsResults: any = {}

  tableDisplaySize = 10
  tableDisplaySizeReplace = 10

  constructor(
    private service: PrepaidCardsService,
    public translate: TranslateService,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.prepaidCardsResults.items = []
    this.prepaidCardsResults.size = 0
    this.prepaidCardsResults.total = 0
    this.sharedData.tableSelected = []

    this.replacePrepaidCardsResults.items = []
    this.replacePrepaidCardsResults.size = 0
    this.replacePrepaidCardsResults.total = 0
    this.sharedData.replaceTableSelected = []

    // Llamada al Activate Option

    this.setPage(null)
    // Removed replace from the workflow
    // this.setPageReplace(null);
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.subscriptions.push(
      this.service
        .getPending(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            // console.log('result: ', result);
            this.prepaidCardsResults = result.prepaidCardsPagedResults
          }
        }),
    )
  }

  public setPageReplace(pageInfo): void {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.subscriptions.push(
      this.service
        .getPendingReplace(pageInfo.offset + 1, this.tableDisplaySizeReplace)
        .subscribe((result) => {
          if (!result.error) {
            // console.log('result replace: ', result);
            this.replacePrepaidCardsResults =
              result.prepaidReplaceCardPagedResults
          }
        }),
    )
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

  onSelectReplace({ selected }) {
    this.sharedData.replaceTableSelected.splice(
      0,
      this.sharedData.replaceTableSelected.length,
    )
    this.sharedData.replaceTableSelected.push(...selected)
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  // changeDisplaySizeReplace(event) {
  //     this.tableDisplaySizeReplace = event;
  //     this.setPageReplace(null);
  // }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['currencyCode'] = item.currency
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'nextStatus',
        )
      })
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  mockPAPrepaidCards(): any[] {
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
