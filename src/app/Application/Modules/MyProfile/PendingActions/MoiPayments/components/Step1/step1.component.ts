import { DatePipe } from '@angular/common'
import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { MoiPaymentsService } from '../../moi-payments.service'
@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  paymentsPagedResults: any = {}
  paymentsDisplaySize = 20
  paymentsSubscription: Subscription

  refundsPagedResults: any = {}
  refundsDisplaySize = 20
  refundsSubscription: Subscription
  paymentsSelectedSubscription: Subscription
  refundsSelectedSubscription: Subscription

  constructor(
    private service: MoiPaymentsService,
    public translate: TranslateService,
    public levelFormatPipe: LevelFormatPipe,
    private injector: Injector,
    public datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.paymentsPagedResults.items = []
    this.paymentsPagedResults.size = 0
    this.paymentsPagedResults.total = 0
    this.sharedData.paymentsSelected = []
    this.setPagePayments(null)

    this.refundsPagedResults.items = []
    this.refundsPagedResults.size = 0
    this.refundsPagedResults.total = 0
    this.sharedData.refundsSelected = []
    this.setPageRefunds(null)

    this.paymentsSelectedSubscription = this.service.paymentsSelected.subscribe(
      (selected) => {
        this.sharedData.paymentsSelected = selected
      },
    )

    this.refundsSelectedSubscription = this.service.refundsSelected.subscribe(
      (selected) => {
        this.sharedData.refundsSelected = selected
      },
    )
  }

  setPagePayments(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.paymentsSubscription = this.service
      .getListSP(pageInfo.offset + 1, this.paymentsDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.paymentsPagedResults = result.pendingItems
          this.paymentsPagedResults.items.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
            const strDate = this.datePipe.transform(
              new Date(item['initiationDate']),
              'dd/MM/yyyy hh:mm',
            )
            item['_initiation'] = strDate
          })
        }
        this.paymentsSubscription.unsubscribe()
      })
  }

  setPageRefunds(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.refundsSubscription = this.service
      .getListRS(pageInfo.offset + 1, this.refundsDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.refundsPagedResults = result.pendingItems
          this.refundsPagedResults.items.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
            const strDate = this.datePipe.transform(
              new Date(item['initiationDate']),
              'dd/MM/yyyy hh:mm',
            )
            item['_initiation'] = strDate
          })
        }
        this.refundsSubscription.unsubscribe()
      })
  }

  // onSelect({ selected }) {
  //   //console.log('Select Event', selected, this.tableSelectedRows);
  //   this.sharedData.tableSelected.splice(
  //     0,
  //     this.sharedData.tableSelected.length
  //   );
  //   this.sharedData.tableSelected.push(...selected);
  // }

  // onSelectRefounds({ selected }) {
  //   //console.log('Select Event', selected, this.tableSelectedRows);
  //   this.sharedData.refundsSelected.splice(0,this.sharedData.refundsSelected.length);
  //   this.sharedData.refundsSelected.push(...selected);
  //   this.service.refundsSelectedRows = this.sharedData.refundsSelected;
  // }

  changeDisplayPayment(event) {
    this.paymentsDisplaySize = event
    this.setPagePayments(null)
  }
  changeDisplayRefunds(event) {
    this.refundsDisplaySize = event
    this.setPageRefunds(null)
  }
  ngOnDestroy() {
    this.paymentsSelectedSubscription.unsubscribe()
    this.refundsSelectedSubscription.unsubscribe()
  }
}
