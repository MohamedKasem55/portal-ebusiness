import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from './request-status.service'

//import { Page } from '../../../../Model/page';
//import { PagedData } from "app/Application/Model/paged-data";
//import { ModelRequestStatus } from "./request-status-service.model";

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
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  ngOnInit(): void {
    super.ngOnInit()
    this.requestStatus.batchPayrollsList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  setPageSize(event) {
    this.tableDisplaySize = event.target.value
    this.setPage(null)
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
          this.requestStatus.accounts = result.accountsWithSaudiRials
          this.requestStatus.page = pageInfo.offset
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.setPayment(row)
    this.requestStatusService.setAccounts(this.requestStatus.accounts)
    this.router.navigate(['/invoiceHUB/request-status/activate'])
  }
}
