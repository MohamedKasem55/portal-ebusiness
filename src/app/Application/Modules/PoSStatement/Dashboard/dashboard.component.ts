import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { Page } from 'app/Application/Model/page'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { interval, Subscription } from 'rxjs'
import { StaticService } from '../../Common/Services/static.service'
import { DashboardService } from './dashboard.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('pageFinancialTransactionTable', { static: true }) table1: any
  @ViewChild('pageTerminalStatisticTable', { static: true }) table2: any
  @ViewChild('pageInactiveTerminalsTable', { static: true }) table3: any

  urlBack = ['/posstatement']

  isCollapsedContent = true
  searchObject = {
    dateFrom: [''],
    dateTo: [''],
  }

  searchForm: FormGroup
  searchFormData: any

  bsConfig: any

  financialTransaction = {}
  terminalStatistic = {}
  inactiveTerminals = {}

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public service: DashboardService,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)

    this.initFinancialTransaction()
    this.initTerminalStatistic()
    this.initInactiveTerminals()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table1)
    tablas.push(this.table2)
    tablas.push(this.table3)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
    )

    this.setFinancialTransactionPage(null)
    this.setTerminalStatisticPage(null)
    this.setInactiveTerminalsPage(null)
  }

  initFinancialTransaction() {
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.financialTransaction['pageData'] = new PagedData<any>()
    this.financialTransaction['pageData'].data = []
    this.financialTransaction['pageData'].page = page
    this.financialTransaction['order'] = 'userId'
    this.financialTransaction['orderType'] = 'desc'
  }

  initTerminalStatistic() {
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.terminalStatistic['pageData'] = new PagedData<any>()
    this.terminalStatistic['pageData'].data = []
    this.terminalStatistic['pageData'].page = page
    this.terminalStatistic['order'] = 'userId'
    this.terminalStatistic['orderType'] = 'desc'
  }

  initInactiveTerminals() {
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.inactiveTerminals['pageData'] = new PagedData<any>()
    this.inactiveTerminals['pageData'].data = []
    this.inactiveTerminals['pageData'].page = page
    this.inactiveTerminals['order'] = 'userId'
    this.inactiveTerminals['orderType'] = 'desc'
  }

  setTerminalStatisticPage(dataTableEvent) {
    const pageData = this.terminalStatistic['pageData']
    const order = this.terminalStatistic['order']
    const orderType = this.terminalStatistic['orderType']

    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    pageData.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .viewTerminalStatistic(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  setTerminalStatisticSort(dataTableEvent) {
    const pageData = this.terminalStatistic['pageData']
    let order = this.terminalStatistic['order']
    let orderType = this.terminalStatistic['orderType']

    if (dataTableEvent.sorts[0]) {
      order = dataTableEvent.sorts[0].prop
      orderType = dataTableEvent.sorts[0].dir
    }

    pageData.page.pageNumber = 0

    this.subscriptions.push(
      this.service
        .viewTerminalStatistic(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  setFinancialTransactionPage(dataTableEvent) {
    const pageData = this.financialTransaction['pageData']
    const order = this.financialTransaction['order']
    const orderType = this.financialTransaction['orderType']

    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    pageData.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .viewFinancialTransactions(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  setFinancialTransactionSort(dataTableEvent) {
    const pageData = this.financialTransaction['pageData']
    let order = this.financialTransaction['order']
    let orderType = this.financialTransaction['orderType']

    if (dataTableEvent.sorts[0]) {
      order = dataTableEvent.sorts[0].prop
      orderType = dataTableEvent.sorts[0].dir
    }

    pageData.page.pageNumber = 0

    this.subscriptions.push(
      this.service
        .viewFinancialTransactions(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  setInactiveTerminalsPage(dataTableEvent) {
    const pageData = this.inactiveTerminals['pageData']
    const order = this.inactiveTerminals['order']
    const orderType = this.inactiveTerminals['orderType']

    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    pageData.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .viewInactiveTerminals(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  setInactiveTerminalsSort(dataTableEvent) {
    const pageData = this.inactiveTerminals['pageData']
    let order = this.inactiveTerminals['order']
    let orderType = this.inactiveTerminals['orderType']

    if (dataTableEvent.sorts[0]) {
      order = dataTableEvent.sorts[0].prop
      orderType = dataTableEvent.sorts[0].dir
    }

    pageData.page.pageNumber = 0

    this.subscriptions.push(
      this.service
        .viewInactiveTerminals(
          this.searchFormData,
          pageData.page.pageNumber + 1,
          pageData.page.pageSize,
          order,
          orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            pageData.page = result.page
            pageData.data = result.data
          }
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.setFinancialTransactionPage(null)
    this.setTerminalStatisticPage(null)
    this.setInactiveTerminalsPage(null)
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }
}
