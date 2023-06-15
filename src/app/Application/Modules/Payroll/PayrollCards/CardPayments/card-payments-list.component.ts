import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { PayrollCardPaymentsService } from './card-payments-service'

@Component({
  selector: 'app-card-payments-list',
  templateUrl: './card-payments-list.component.html',
  styleUrls: ['./card-payments.component.scss'],
})
export class ListCardPaymentsComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('monthFilePageTable', { static: true }) table: any

  subscriptionService: Subscription
  hoverSubscriptionService: Subscription
  monthFilePage: PagedData<any>
  visible: any
  fileDetail = {}

  constructor(
    public translate: TranslateService,
    public cardPaymentsService: PayrollCardPaymentsService,
    private router: Router,
  ) {
    super()
    this.monthFilePage = new PagedData<any>()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage(null)
  }

  details(value: any) {
    this.router.navigate(
      ['/payroll/payroll-cards/card-payments/addCardPayments'],
      {
        queryParams: {
          fileName: value.fileName,
          dirUploadArchive: value.dirUploadArchive,
        },
      },
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    const data = {
      page: 1,
      rows: 10,
    }

    // Service Call
    this.subscriptionService = this.cardPaymentsService
      .loadPreviousMonthList(data)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
          //
        } else {
          if (result.fileList) {
            this.monthFilePage.data = result.fileList.items

            const pageObject = new Page()

            pageObject.pageNumber = 1
            pageObject.pageSize =
              result.fileList && result.fileList.size
                ? result.fileList.size
                : 50
            pageObject.size = result.fileList.size
            pageObject.totalElements = result.fileList.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize
            this.monthFilePage.page = pageObject
          }

          this.subscriptionService.unsubscribe()
        }
      })
  }

  setSort(dataTableEvent) {}

  onError(result) {}
}
