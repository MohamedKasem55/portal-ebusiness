import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from 'app/Application/Model/exception'
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
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective

  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatusSubscription: Subscription
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
    if (this.table) {
      tablas.push(this.table)
    }
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
          this.requestStatus.batchPayrollsList =
            result.pendingAramcoPaymenList.items
          this.requestStatus.size = result.pendingAramcoPaymenList.size
          this.requestStatus.total = result.pendingAramcoPaymenList.total
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusSubscription = this.requestStatusService
      .initPayment(row)
      .subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          return
        } else {
          this.requestStatusService.setAccounts(result.listInitiateAccount)
          this.requestStatusService.setPayment(result.aramcoBatch)
        }
        this.requestStatusSubscription.unsubscribe()
        this.router.navigate(['/aramcoPayments/request-status/activate'])
      })
  }

  openModal(row, popup) {
    if (this.futureLevels) popup.openModal(row.futureSecurityLevelsDTOList)
    else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
