import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { PagedData } from '../../../../Model/paged-data'
import { ReqStstusService } from './req-ststus.service'

@Component({
  selector: 'app-req-status',
  templateUrl: './req-status.component.html',
  styleUrls: ['./req-status.component.scss'],
})
export class ReqStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective

  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatusSubscription: Subscription
  requestStatusPagedData: any = new PagedData<any>()
  tableDisplaySize = 20
  futureLevels = false

  subscriptions: Subscription[] = []

  constructor(
    private requestStatusService: ReqStstusService,
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

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
    this.refreshData()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  refreshData() {
    this.sharedData.tableSelected = []
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.subscriptions.push(
      this.requestStatusService
        .getData(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (result === null) {
          } else {
            this.requestStatusPagedData = {
              page: {
                size: result.data['size'],
                totalElements: result.data['total'],
                totalPages: result.page.totalPages,
                pageNumber: result.page.pageNumber,
                pageSize: result.page.pageSize,
              },
              data: result.data['items'],
            }
          }
        }),
    )
  }

  goActivate(row) {
    //console.log("row", row);
    this.subscriptions.push(
      this.requestStatusService.initPayment(row).subscribe((result: any) => {
        if (
          result.hasOwnProperty('error') &&
          result.error instanceof Exception
        ) {
          return
        } else {
          const body = result
          this.requestStatusService.setAccounts(result.bulkPaymentsFileDetails)
          this.requestStatusService.setPayment(result.filePaymentsDetails)
        }
        this.router.navigate(['/bulk-payment/reqStatus/reinitialize'])
      }),
    )
  }

  openModal(row, popup) {
    /*if(this.futureLevels)
                popup.openModal(row.futureSecurityLevelsDTOList);
            else{
                popup.openModal(row.securityLevelsDTOList);
            }*/
    popup.openModal(row)
  }

  public getTableCurrentPageSize(table) {
    if (table && table.bodyComponent && table.bodyComponent.temp) {
      return table.bodyComponent.temp.length
    }
    return 0
  }

  public getTranslationKey(prefix, key) {
    if (!prefix || prefix === null || prefix === undefined || prefix === '') {
      return key
    }
    return prefix + '.' + key
  }
}
