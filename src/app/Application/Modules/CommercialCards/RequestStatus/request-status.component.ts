import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
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
  implements OnInit, OnDestroy
{
  @ViewChild('table') table: any
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective

  sharedData: any = {}
  getRequestStatusSubscription: Subscription[] = []
  requestStatus: any = {}
  tableDisplaySize = 20
  futureLevels = false
  bsConfig: any
  constructor(
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.requestStatus.batchCommercialCardsList = []
    this.requestStatus.batchPayrollsList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0
    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription.push(
      this.requestStatusService
        .getList(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            this.requestStatus.batchCommercialCardsList =
              result.businessCardsPagedResults.items
            this.requestStatus.size = result.businessCardsPagedResults.size
            this.requestStatus.total = result.businessCardsPagedResults.total
          }
        }),
    )
  }

  goActivate(row) {
    this.requestStatusService.setCardDetails(row)
    this.router.navigate(['/businessCards/requeststatus/activate'])
  }

  ngOnDestroy() {
    this.getRequestStatusSubscription.forEach((subscription) =>
      subscription.unsubscribe(),
    )
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
