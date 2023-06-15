import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
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
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
    private injector: Injector,
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

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.requestStatusService
      .getData(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.processItemsLevels(result.pendingPayrollList.items)
          this.requestStatus = result.pendingPayrollList
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    //
    this.requestStatusService.getBatch(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setPayment(result)
        this.router.navigate([
          '/wmspayroll/wmspayroll-management/request-status/activate',
        ])
      }
    })
  }

  goActivateFile(row) {
    //
    this.requestStatusService.getBatchFile(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setPaymentFile(result)
        this.router.navigate([
          '/wmspayroll/wmspayroll-management/request-status/activate-file',
        ])
      }
    })
  }
  openModal(row, popup) {
    popup.openModal(row)
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
      })
    }
  }
}
