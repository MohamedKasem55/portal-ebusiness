import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { RequestStatusService } from './request-status.service'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table') table: any
  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}
  requestStatusStopCheque: any = {}
  tableDisplaySize = 20
  tableDisplaySizeStop = 20
  futureLevels = false
  constructor(
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.requestStatus.batchList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.sharedData.tableSelected = []
    this.requestStatusStopCheque.batchList = []
    this.requestStatusStopCheque.size = 0
    this.requestStatusStopCheque.total = 0
    if (
      this.authenticationService.activateOption(
        'ChequeInquiry',
        [],
        ['RequestCheckBookGroup'],
      )
    ) {
      this.setPage(null)
    }
    if (
      this.authenticationService.activateOption(
        'ChequeStop',
        [],
        ['StopCheckBookGroup'],
      )
    ) {
      this.setPageStopCheque(null)
    }
  }

  ngOnDestroy() {
    if (this.getRequestStatusSubscription)
      this.getRequestStatusSubscription.unsubscribe()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(pageInfo) {
    if (pageInfo == null) pageInfo = { offset: 0 }

    this.getRequestStatusSubscription = this.requestStatusService
      .getData(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.batchList = result.batchList.items
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
        }
      })
  }

  setPageStopCheque(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.requestStatusService
      .getDataStop(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatusStopCheque.batchList = result.batchList.items
          this.requestStatusStopCheque.size = result.batchList.size
          this.requestStatusStopCheque.total = result.batchList.total
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.setrecoverData(row)
    this.router.navigate(['/accounts/chequebook/request-status/activate'])
  }

  goActivateStop(row) {
    this.requestStatusService.setrecoverData(row)
    this.router.navigate(['/accounts/chequebook/request-status/activateStop'])
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
