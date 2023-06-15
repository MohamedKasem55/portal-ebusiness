import { Component, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { PaymentsService } from '../../payments.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  getPendingBillBatchesSubscription: Subscription
  selectedSubscription: Subscription
  billsPagedResults: any = {}
  tableDisplaySize = 20

  constructor(
    private service: PaymentsService,
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
  ) {}

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.billsPagedResults.items = []
    this.billsPagedResults.size = 0
    this.billsPagedResults.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)

    this.selectedSubscription = this.service.getSelected.subscribe(
      (selected) => {
        this.sharedData.tableSelected = selected
      },
    )
  }
  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingBillBatchesSubscription = this.service
      .getPending(pageInfo.offset + 1, pageInfo.pageSize)
      .subscribe((result) => {
        if (!result.error) {
          this.billsPagedResults = result.pendingAramcoPaymenList
          this.translateLevels()
        }
        this.getPendingBillBatchesSubscription.unsubscribe()
      })
  }

  // onSelect({ selected }) {
  //   this.sharedData.tableSelected.splice(
  //     0,
  //     this.sharedData.tableSelected.length
  //   );
  //   this.sharedData.tableSelected.push(...selected);
  // }

  changeDisplayWithin(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  private translateLevels(): void {
    if (this.billsPagedResults && this.billsPagedResults.items) {
      let levels

      for (const item of this.billsPagedResults.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }
  }
}
