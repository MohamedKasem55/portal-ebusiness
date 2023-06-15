import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { RequestStatusService } from '../../request-status.service'

@Component({
  selector: 'app-card-payments',
  templateUrl: './card-payments.component.html',
})
export class CardPaymentsComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  getCardPaymentsSubscription: Subscription
  bsConfig: any
  searchForm: FormGroup
  dateFromMax: Date = new Date()
  futureLevels = false

  cardPaymentsResults: PagedData<any>

  constructor(
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public fb: FormBuilder,
  ) {
    super()

    this.searchForm = this.fb.group({
      dateFrom: [],
      dateTo: [],
      name: [],
      status: [],
    })

    this.cardPaymentsResults = new PagedData<any>()
    this.cardPaymentsResults.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.cardPaymentsResults.page = page
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

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  search() {
    this.setPage(null)
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  goActivate(row) {
    this.requestStatusService.getBatchPayment(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setPayment(result)
        this.router.navigate([
          '/payroll/payroll-cards/request-status/card-payments/activate',
        ])
      }
    })
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    const page = pageInfo.offset + 1
    const pageSize = this.cardPaymentsResults.page.pageSize

    const criteria = Object.assign({}, this.searchForm.value)

    this.getCardPaymentsSubscription = this.requestStatusService
      .getCardPaymentsList(page, pageSize, criteria)
      .subscribe((result) => {
        if (!result.error) {
          const output = result.batchListPayrolCardPayment
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = pageSize
          pageObject.size = output.size
          pageObject.totalElements = output.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          const pagedData = new PagedData<any>()
          pagedData.data = output['data'] ? output['data'] : output['items']
          pagedData.page = pageObject

          this.cardPaymentsResults = pagedData
        }
        this.getCardPaymentsSubscription.unsubscribe()
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
