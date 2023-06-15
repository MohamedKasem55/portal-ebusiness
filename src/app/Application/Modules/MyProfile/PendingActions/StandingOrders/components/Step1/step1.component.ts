import { Component, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StandingOrdersService } from '../../standing-orders.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  tablePagedResults: any = {}
  tableDisplaySize = 20
  tableSubscription: Subscription
  selectedSubscription: Subscription

  constructor(
    private service: StandingOrdersService,
    public translate: TranslateService,
  ) {}

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.tablePagedResults.items = []
    this.tablePagedResults.size = 0
    this.tablePagedResults.total = 0
    this.sharedData.tableSelected = []

    this.setPage(null)

    this.selectedSubscription = this.service.getTableSelected.subscribe(
      (selected) => {
        this.sharedData.tableSelected = selected
        // console.log( this.sharedData.tableSelected);
      },
    )
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.tableSubscription = this.service
      .getList(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.tablePagedResults.items = result.pendingStandingOrderList.items
          this.tablePagedResults.total = result.pendingStandingOrderList.total
        }
        this.tableSubscription.unsubscribe()
      })
  }

  // onSelect({ selected }) {
  //   this.sharedData.tableSelected.splice(
  //     0,
  //     this.sharedData.tableSelected.length
  //   );
  //   this.sharedData.tableSelected.push(...selected);
  // }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }
}
