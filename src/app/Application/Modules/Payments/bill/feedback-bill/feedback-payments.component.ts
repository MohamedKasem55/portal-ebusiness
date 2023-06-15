import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { ModelFeedbacktBill } from '../../Model/bill.feedback.model'
import { FeedbackBillService } from './bill.feedback.service'

@Component({
  templateUrl: './feedback-bill.payment.html',
})
export class FeedbackBillComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('FeedbacktablePageTable', { static: true }) table: any
  public FeedbacktablePage: PagedData<ModelFeedbacktBill>

  order: string
  orderType: string
  loading: boolean

  constructor(
    public service: FeedbackBillService,
    public translate: TranslateService,
  ) {
    super()
    this.FeedbacktablePage = new PagedData<ModelFeedbacktBill>()
    this.order = 'accountfrom'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    // Service Call
    this.service
      .getResults(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.FeedbacktablePage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.FeedbacktablePage = result
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.FeedbacktablePage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.service
      .getResults(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.FeedbacktablePage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.FeedbacktablePage = result
        }
      })
  }

  onError(result) {
    //
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }
  ngOnDestroy() {}
}
