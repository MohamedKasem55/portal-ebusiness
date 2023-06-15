import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from '../../request-status.service'

@Component({
  selector: 'app-request-new-cards-online',
  templateUrl: './request-new-cards-online.component.html',
})
export class RequestNewCardsOnlineComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  getRequestNewCardsOnlineSubscription: Subscription
  RequestNewCardsOnlineResults: any = {}
  tableDisplaySize = 20
  futureLevels = false

  isCollapsedContentDetails = true
  bsConfig: any
  search: any = {}
  dateFromMax: Date = new Date()
  constructor(
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.RequestNewCardsOnlineResults.items = []
    this.RequestNewCardsOnlineResults.size = 0
    this.RequestNewCardsOnlineResults.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  searchData() {
    this.setPage(null)
  }

  reset() {
    this.search = {}
    this.searchData()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestNewCardsOnlineSubscription = this.requestStatusService
      .getRequestNewCardsOnline(
        pageInfo.offset + 1,
        this.tableDisplaySize,
        this.search,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.RequestNewCardsOnlineResults = result.batchListPayrolCard
        }
        this.getRequestNewCardsOnlineSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.getBatchNewCardOnline(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setNewCardOnline(result)
        this.router.navigate([
          '/payroll/payroll-cards/request-status/request-new-card-online/activate',
        ])
      }
    })
  }

  changeDateTop(event) {
    if (event instanceof Date) {
      this.dateFromMax = event
    } else {
      this.dateFromMax = new Date()
    }
  }
  openModal(row, popup) {
    popup.openModal(row)
  }
}
