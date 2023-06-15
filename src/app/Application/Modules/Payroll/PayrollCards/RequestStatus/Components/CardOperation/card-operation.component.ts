import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from '../../request-status.service'

@Component({
  selector: 'app-card-operation',
  templateUrl: './card-operation.component.html',
})
export class CardOperationComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  getCardOperationSubscription: Subscription
  cardOperationResults: any = {}
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
    this.cardOperationResults.items = []
    this.cardOperationResults.size = 0
    this.cardOperationResults.total = 0

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

  goActivate(row) {
    this.requestStatusService.setOperation(row)
    this.router.navigate([
      '/payroll/payroll-cards/request-status/card-operation/activate',
    ])
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getCardOperationSubscription = this.requestStatusService
      .getCardOperations(
        pageInfo.offset + 1,
        this.tableDisplaySize,
        this.search,
      )
      .subscribe((result: any) => {
        if (!result.error) {
          this.cardOperationResults = result.listOperations
          if (result.listOperations.items.length >= this.tableDisplaySize) {
            this.cardOperationResults.size = this.tableDisplaySize
          } else {
            this.cardOperationResults.size = result.listOperations.items.length
          }
        }
        this.getCardOperationSubscription.unsubscribe()
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
