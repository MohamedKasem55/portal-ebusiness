import { Location } from '@angular/common'
import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { PagedData } from '../../../../Model/paged-data'
// Service to GET list of payments orders
import { RequestStatusPayments } from '../Services/request-status-payments-list.service'
import { RequestStatusRefunds } from '../Services/request-status-refunds-list.service'
import { RequestStatusService } from './request-status.service'

@Component({
  templateUrl: './request-status.component.html',
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  paymentsListPage: PagedData<any>
  refundsListPage: PagedData<any>
  requestPaymentsData: any = []
  requestRefundsData: any = []
  futureLevels = false

  constructor(
    private requestStatusPayments: RequestStatusPayments,
    private requestStatusRefunds: RequestStatusRefunds,
    private requestStatusService: RequestStatusService,
    private _location: Location,
    private router: Router,
    public translate: TranslateService,
    public levelFormatPipe: LevelFormatPipe,
    private injector: Injector,
  ) {
    super()
    this.paymentsListPage = new PagedData<any>()
    this.refundsListPage = new PagedData<any>()
  }

  setPagePayments(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    // Service Call
    this.requestStatusPayments
      .getResults(
        dataTableEvent.offset + 1,
        this.paymentsListPage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.paymentsListPage = result
          this.paymentsListPage.data.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
          })
        }
      })
  }

  setPageRefunds(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    // Service Call
    this.requestStatusRefunds
      .getResults(dataTableEvent.offset + 1, this.refundsListPage.page.pageSize)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.refundsListPage = result
          this.refundsListPage.data.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
          })
        }
      })
  }

  setSortPayments(dataTableEvent) {}

  setSortRefunds(dataTableEvent) {}

  onError(result) {}

  ngOnInit() {
    // -----------------------------------------------------------------------------------
    // INITIAL LOADING OF THE DATABASE WITH LIST OF PAYMENTS AND REFUNDS */
    // -----------------------------------------------------------------------------------
    this.setPagePayments({ offset: 0 })
    this.setPageRefunds({ offset: 0 })
  }

  totalFees(fees: any[]) {
    if (fees) {
      let total = 0
      for (let i = fees.length - 1; i >= 0; i--) {
        total += fees[i].feeAmount
      }
      return total
    }
    return
  }

  ngOnDestroy() {}

  goActivate(row, type) {
    this.requestStatusService.setType(type)
    this.requestStatusService.details(row).subscribe((result) => {
      this.requestStatusService.setElement(result)
      this.requestStatusService.setActivating(true)
      this.router.navigate(['/payments/moi/request-status/activate'])
    })
  }

  goDetail(row, type) {
    this.requestStatusService.setType(type)
    this.requestStatusService.details(row).subscribe((result) => {
      this.requestStatusService.setElement(result)
      this.requestStatusService.setActivating(false)
      this.router.navigate(['/payments/moi/request-status/activate'])
    })
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
