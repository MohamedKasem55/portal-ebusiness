import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from './request-status.service'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}
  tableDisplaySize = 20
  futureLevels = false

  constructor(
    public requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.setPage(null)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.requestStatusService
      .getData(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.batchPayrollsList = result.batchList.items
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.setrecoverData(row)
    this.router.navigate([
      '/accounts/chequebook/positive-payment/request-status/activate',
    ])
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
