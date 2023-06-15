import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
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
  getRequestStatusSubscription: Subscription
  requestStatusSubscription: Subscription
  requestStatus: any = {}
  requestStatusReplace: any = {}
  tableDisplaySize = 10
  tableDisplaySizeReplace = 10
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
    this.requestStatus.batchPrepaidCardsList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0
    this.sharedData.tableSelected = []
    this.setPage(null)
    this.requestStatusReplace.batchPrepaidCardsList = []
    this.requestStatusReplace.size = 0
    this.requestStatusReplace.total = 0
    this.sharedData.replaceTableSelected = []
    // Removed replace from workflow
    // this.setPageReplace(null);
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  getRoutes(): any[] {
    const routes = [['prePaidCard.name'], ['prePaidCard.requestStatus']]

    return routes
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.subscriptions.push(
      this.requestStatusService
        .getList(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            this.requestStatus.batchPrepaidCardsList =
              result.prepaidCardsPagedResults.items
            this.requestStatus.size = result.prepaidCardsPagedResults.size
            this.requestStatus.total = result.prepaidCardsPagedResults.total
          }
        }),
    )
  }

  public setPageReplace(pageInfo): void {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.subscriptions.push(
      this.requestStatusService
        .getListReplace(pageInfo.offset + 1, this.tableDisplaySizeReplace)
        .subscribe((result) => {
          if (!result.error) {
            this.requestStatusReplace.batchPrepaidCardsList =
              result.prepaidReplaceCardPagedResults.items
            this.requestStatusReplace.size =
              result.prepaidReplaceCardPagedResults.size
            this.requestStatusReplace.total =
              result.prepaidReplaceCardPagedResults.total
          }
        }),
    )
  }

  goActivate(row) {
    this.requestStatusService.setCardDetails(row)
    this.router.navigate(['/prepaid-card/requeststatus/activate'])
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  public changeDisplaySize(event): void {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  // public changeDisplaySizeReplace(event): void {

  //   this.tableDisplaySizeReplace = event;
  //   this.setPageReplace(null);

  // }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
