//Service
import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { Page } from '../../../../Model/page'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../core/storage/storage.service'

@Component({
  selector: 'app-card-operations-step1',
  templateUrl: './card-operations-step1.component.html',
})
export class CardOperationsStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  payrollCardPage: any = {}
  tablePaymentsLimit = 20
  tableSelectedRows: any = []
  public selected = []
  @ViewChild('stepForm', { static: true }) stepForm: NgForm
  // @ViewChild('payrollCardTable', {static: false})
  // payrollCardTable: any;
  sharedData: any = {}
  step = 1
  isCollapsedContent = true
  //Search fields
  nationalId = ''
  cardNumber = ''
  status = ''
  selectedIncentiveCards = ''
  statusSearch = ''
  cardNumberSearch = ''
  nationalIdSearch = ''
  selectedIncentiveCardsSearch = ''
  public rows
  operationsType = []
  coboStatus = []
  public operationType
  operationCode

  closeServicePayRollOperation: Subscription
  subscriptions: Subscription[] = []
  selectAllOnPage: any = []

  combosSolicitados = [
    'incentiveCardsStatus',
    'payrollCardsOptions',
    'payrollCardsOptionsWithoutNationalAddress',
  ]

  public url: any

  constructor(
    public translate: TranslateService,
    private staticService: StaticService,
    private _http: HttpClient,
    private _config: ConfigResourceService,
    private authentication: AuthenticationService,
    public storageService: StorageService,
  ) {
    super()
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 20
    this.payrollCardPage.page = page
    this.payrollCardPage.items = []
    this.payrollCardPage.size = 0
    this.payrollCardPage.total = 0
    this.url = this._config.getServicesUrl()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData.operationType = ''
    this.sharedData.operationCode = ''

    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(() => {
        this.refreshData()
      }),
    )

    if (
      typeof this.sharedData.selectedRows != 'undefined' &&
      this.sharedData.selectedRows.length > 0
    ) {
      this.tableSelectedRows = this.sharedData.selectedRows
    } else {
      this.tableSelectedRows = []
    }

    // this.getOperationType();
  }

  /**
   * @deprecated
   */
  public getOperationType() {
    this._http
      .post(this.url + '/payrollCards/operations/list', {})
      .subscribe((res) => {
        this.operationType = res['operations']
      })
  }

  public selectOperationType(event) {
    console.log('event: ', event)
    this.sharedData.operationCode = event
    console.log(
      '🚀 ~ file: card-operations-step1.component.ts ~ line 116 ~ selectOperationType ~ this.sharedData.operationCode',
      this.sharedData.operationCode,
    )
  }

  refreshData() {
    this.closeServicePayRollOperation = this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.coboStatus =
          data[this.combosSolicitados.indexOf('incentiveCardsStatus')]['values']
        this.sharedData.coboStatus = this.coboStatus
        if (this.haveToShowNational()) {
          this.operationType =
            data[
              this.combosSolicitados.indexOf(
                'payrollCardsOptionsWithoutNationalAddress',
              )
            ]['values']
        } else {
          this.operationType =
            data[this.combosSolicitados.indexOf('payrollCardsOptions')][
              'values'
            ]
        }

        this.sharedData.operationsType = this.operationType

        this.setPage(null)
      })
  }

  haveToShowNational() {
    const welcome = this.storageService.retrieve('welcome')
    return welcome.nationalAdress == 'N'
  }

  onCriteriaChange(value) {
    this.selectedIncentiveCards = value
    if (value === 'nationalId') {
      this.nationalId = ''
      this.cardNumber = ''
      this.status = null
    }
    if (value === 'cardNumber') {
      this.nationalId = ''
      this.cardNumber = ''
      this.status = null
    }
    if (value === 'status') {
      this.nationalId = ''
      this.cardNumber = ''
      this.status = null
    }
  }

  search() {
    this.sharedData.selectedRows = []
    this.tableSelectedRows = []
    this.nationalIdSearch = this.nationalId
    this.cardNumberSearch = this.cardNumber
    this.statusSearch = this.status
    this.selectedIncentiveCardsSearch = this.selectedIncentiveCards
    this.setPage(null)
  }

  reset() {
    this.nationalId = ''
    this.cardNumber = ''
    this.status = ''
    this.selectedIncentiveCards = ''
    this.search()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.payrollCardPage.page.pageNumber = pageInfo.offset + 1

    const data = {
      cardReferenceNumber: this.cardNumberSearch,
      departmentCode: '',
      nationalId: this.nationalIdSearch,
      page: pageInfo.offset + 1,
      rows: this.tablePaymentsLimit,
      selectedIncentiveCards: this.selectedIncentiveCardsSearch,
      status: this.statusSearch,
    }

    // Service Call
    this._http
      .post(this.url + '/payrollCards/operations/initiate', data)
      .subscribe((result) => {
        if (result !== null) {
          this.payrollCardPage.items =
            result['cardIncentiveInstitutionsListOutput'][
              'cardIncentiveInstitutionsList'
            ]
          this.payrollCardPage.total =
            result['cardIncentiveInstitutionsListOutput']['total']
          this.payrollCardPage.size =
            result['cardIncentiveInstitutionsListOutput']['size']
          this.payrollCardPage.items.forEach((ele) => {
            ele['statusIncentive'] = ele.status
          })
          this.rows = this.payrollCardPage.items
        }
      })
  }

  setSort() {}

  onSelect({ selected }) {
    this.selectAllOnPage[this.payrollCardPage.page.pageNumber] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)

    this.sharedData.selectedRows = this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.payrollCardPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.payrollCardPage.items.map((payroll) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(payroll),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.payrollCardPage.items)
      this.selectAllOnPage[this.payrollCardPage.page.pageNumber] = true
      this.sharedData.selectedRows = this.tableSelectedRows
    } else {
      // Unselect all
      this.payrollCardPage.items.map((payroll) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(payroll),
        )
      })
      this.selectAllOnPage[this.payrollCardPage.page.pageNumber] = false
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getId(row) {
    return row['cardNumber']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
