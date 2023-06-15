import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { StaticService } from '../../../../../Common/Services/static.service'
import { InvoiceHUBService } from '../../invoiceHUB.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  pendingSubscriptions: Subscription
  selectedSubscription: Subscription
  pageResult: any = {}
  tableDisplaySize = 20

  combosData: any = {}
  constructor(
    private service: InvoiceHUBService,
    public translate: TranslateService,
    private injector: Injector,
    private staticService: StaticService,
  ) {}

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.pageResult = new PagedData()
    const combosKeys = ['batchSecurityLevelStatus']
    this.combosData['batchSecurityLevelStatus'] = []

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const statusValues =
        data[combosKeys.indexOf('batchSecurityLevelStatus')]['values']
      Object.keys(statusValues).map((key, index) => {
        this.combosData['batchSecurityLevelStatus'][key] = statusValues[key]
      })
    })
    this.pageResult = new PagedData()
    this.pageResult.items = []
    this.pageResult.size = 0
    this.pageResult.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)

    this.selectedSubscription = this.service.getSelected.subscribe(
      (selected) => {
        // console.log('shared- subscription',billPaymentsSelected);
        this.sharedData.tableSelected = selected
    })
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.pendingSubscriptions = this.service
      .getPending(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          const page = new Page()
          this.pageResult = new PagedData()
          this.pageResult.data = result.saddadInvoicePagedResults.items
          page.totalElements = result.saddadInvoicePagedResults.total
          page.size =
            this.pageResult.data.length > page.pageSize
              ? page.pageSize
              : this.pageResult.data.length
          page.totalPages = page.totalElements / page.pageSize
          this.pageResult.page = page
          this.processItemsLevels(this.pageResult.data)
        }
        this.pendingSubscriptions.unsubscribe()
      })
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'nextStatus',
        )
        item['statusExport'] = this.combosData['batchSecurityLevelStatus'][
          item.status
        ]
          ? this.combosData['batchSecurityLevelStatus'][item.status]
          : item.status
      })
    }
  }
}
