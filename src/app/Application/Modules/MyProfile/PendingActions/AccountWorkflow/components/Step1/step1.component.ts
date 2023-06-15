import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { AccountWorkflowService } from '../../account-workflow.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  step = 1
  sharedData: any = {}

  getPendingAccountSubscription: Subscription
  getPendingNonfinancialSubscription: Subscription

  accountPagedResults: any = {}
  nonfinancePagedResults: any = {}

  tableDisplaySize = 20
  tableNonfinanceDisplaySize = 20

  constructor(
    private service: AccountWorkflowService,
    public translate: TranslateService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.accountPagedResults.items = []
    this.accountPagedResults.size = 0
    this.accountPagedResults.total = 0

    this.nonfinancePagedResults.items = []
    this.nonfinancePagedResults.size = 0
    this.nonfinancePagedResults.total = 0

    this.sharedData.tableAccountSelected = []
    this.sharedData.tableNonfinancialSelected = []

    this.setPage(null)
    this.setPageNonfinance(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingAccountSubscription = this.service
      .getPending(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.accountPagedResults = result.pendingWorkflowAccountBatchList
          // sort register
          this.accountPagedResults['items'].sort((a, b) => {
            return a['initiationDate'] > b['initiationDate'] ? -1 : b['initiationDate'] > a['initiationDate'] ? 1 : 0
          })
        }
        this.getPendingAccountSubscription.unsubscribe()
      })
  }

  setPageNonfinance(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingNonfinancialSubscription = this.service
      .getPendingnonFinancial(
        pageInfo.offset + 1,
        this.tableNonfinanceDisplaySize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.nonfinancePagedResults =
            result.pendingWorkflowNonFinancialBatchList
        }
        this.getPendingNonfinancialSubscription.unsubscribe()
      })
  }

  onSelect({ selected }) {
    //console.log('Select Event', selected);
    this.sharedData.tableNonfinancialSelected = []
    this.clearTable(this.nonfinancePagedResults)
    this.sharedData.tableAccountSelected.splice(
      0,
      this.sharedData.tableAccountSelected.length,
    )
    this.sharedData.tableAccountSelected.push(...selected)
  }

  onSelectnonfinance({ selected }) {
    //console.log('Select Event', selected);
    this.sharedData.tableAccountSelected = []
    this.clearTable(this.accountPagedResults)
    this.sharedData.tableNonfinancialSelected.splice(
      0,
      this.sharedData.tableNonfinancialSelected.length,
    )
    this.sharedData.tableNonfinancialSelected.push(...selected)
  }

  clearTable(element) {
    const items = Object.assign([], element.items)
    element.items = []
    element.items.push(...items)
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  changeDisplaySizeNonFinancial(event) {
    this.tableNonfinanceDisplaySize = event
    this.setPageNonfinance(null)
  }
}
