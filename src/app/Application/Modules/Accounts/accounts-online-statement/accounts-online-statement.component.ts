import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { Account } from '../../../Model/account'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { CurrentAccountsService } from '../accounts-current-account/accounts-current-account.service'
import { ModelStatement } from '../Model/accounts-statement.model'
import { SelectedDataService } from '../Services/selected-data-service'

@Component({
  templateUrl: './accounts-online-statement.component.html',
  styles: [
    '/deep/ #onLineStatementTablePanel .sme-form__form { z-index: 1000 !important;}',
  ],
})
// Component class
export class AccountsOnlineStatementComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('statmentTable') table: any

  data: Account
  form: FormGroup

  public accounts: Account[] = []
  public selectedAccount: Account

  today: Date = new Date()

  dateFrom: Date
  dateTo: Date
  amountTo: number
  amountFrom: number
  show: any
  filterBy: any = ''
  filtersType: any = []

  searchDateFrom: Date
  searchDateTo: Date
  searchAmountTo: number
  searchAmountFrom: number
  searchShow: any
  searchFilterBy: any

  stmtDetails: any

  details: any
  channels: any

  groupRows = 0

  accountBalancePage: PagedData<ModelStatement>
  limit: any

  isCollapsedContent = true
  isCollapsedFilter = true

  order: string
  orderType: string
  loading: boolean

  subscriptions: Subscription[] = []

  visible: number
  visibleDetail: number
  combosSolicitados = ['filterType']

  bsConfig: any
  maxDate: Date

  customerName = ''

  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public service: CurrentAccountsService,
    public staticService: StaticService,
    public storage: StorageService,
    public selectedUserDataService: SelectedDataService,
    public translate: TranslateService,
    private smq: SimpleMQ,
    private injector: Injector,
  ) {
    super()
    this.accountBalancePage = new PagedData<ModelStatement>()
    this.accountBalancePage.page.pageSize = 20
    this.order = ''
    this.orderType = ''
    this.limit = JSON.parse(storage.retrieve('currentUser'))['company'][
      'companyLimits'
    ]
    this.maxDate = new Date()
  }

  search() {
    this.searchDateFrom = this.dateFrom
    //console.log(this.dateFrom);
    this.searchDateTo = this.dateTo
    this.searchAmountTo = this.amountTo
    this.searchAmountFrom = this.amountFrom
    this.searchShow = this.show
    this.searchFilterBy = this.filterBy
    this.setPage(null)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 1 }
    }

    if (dataTableEvent.count) {
      // reload en cambio de idioa

      this.accountBalancePage.page.pageNumber = dataTableEvent.offset
    } else {
      this.accountBalancePage.page.pageNumber = dataTableEvent.offset - 1
    }
    this.loading = true
    this.service
      .getStatements(
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          //      //
          this.accountBalancePage = result
          this.accountBalancePage.data = this.group(result.data)
          this.expandAllTableRows()
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.accountBalancePage.page.pageNumber = 1

    this.loading = true
    this.service
      .getStatements(
        this.accountBalancePage.page.pageNumber,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.accountBalancePage = result
          this.accountBalancePage.data = this.group(result.data)
        }
      })
  }

  onError(result) {}

  refreshData() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.filtersType = []
        const valores =
          data[this.combosSolicitados.indexOf('filterType')]['values']
        this.details = valores
        Object.keys(valores).map((key, index) => {
          if (!(key === 'order')) {
            this.filtersType.push({ key, value: valores[key] })
          }
        })
        this.filtersType = this.filtersType.sort((a, b) => {
          return a['value'] > b['value'] ? 1 : b['value'] > a['value'] ? -1 : 0
        })
      })
    this.setPage({ offset: this.accountBalancePage.page.pageNumber })
  }

  ngOnInit() {
    super.ngOnInit()
    this._setaccounts()
    this.show = 0
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )

    // this.data = this.selectedUserDataService.getModelServiceCurrentAccount();
    // this.selectedUserDataService.clearModelServiceCurrentAccount();
    this.loadAccountData()
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.filtersType = []
        const valores =
          data[this.combosSolicitados.indexOf('filterType')]['values']
        this.details = valores
        Object.keys(valores).map((key, index) => {
          if (!(key === 'order')) {
            this.filtersType.push({ key, value: valores[key] })
          }
        })
        this.filtersType = this.filtersType.sort((a, b) => {
          return a['value'] > b['value'] ? 1 : b['value'] > a['value'] ? -1 : 0
        })
      })
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.subscriptions.push(
          this.service.getAccount(this.data.accountPk).subscribe((result) => {
            this.data = result
            this.refreshData()
          }),
        )
      }),
    )

    const combosKeys = ['currency', 'currencyIso']

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosKeys, true)
        .subscribe((resultC) => {
          if (resultC === null) {
            //this.onError(resultC);
          } else {
            const data: Object = resultC
            const combos = []
            for (let i = 0; i < combosKeys.length; i++) {
              combos.push({
                name: combosKeys[i],
                comboValues: data[combosKeys[i]],
              })
              // this.combosData[combosKeys[i]] = data[combosKeys[i]];
            }
            this.service.requestedCombos = combos
            // ----------------------------

            this.search()
          }
        }),
    )
  }

  public loadAccountData(): void {
    this.data = this.selectedUserDataService.getModelServiceCurrentAccount()
    this.customerName = this.selectedUserDataService.getCustomerName()
    this.selectedUserDataService.clearModelServiceCurrentAccount()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  amountValid(): boolean {
    if (!this.amountFrom || !this.amountTo) {
      return true
    }
    return this.amountFrom * 1 <= this.amountTo * 1
  }

  group(result): any[] {
    const statments = []
    const date = null
    if (this.dateFrom) {
      this.dateFrom.setHours(0)
    }
    //console.log(this.dateFrom)
    if (this.dateTo) {
      this.dateTo.setHours(23)
    }
    //console.log(this.dateTo)
    for (const d of result) {
      d['amount'] = d.amount
      d['debit'] = d.amount < 0 ? d.amount : ''
      d['credit'] = d.amount > 0 ? d.amount : ''
      d['hour'] = this.formatHour(d.time)
      statments.push(d)
    }
    return statments
  }

  filters() {
    this.setPage(null)
  }

  reset() {
    this.dateFrom = null
    this.dateTo = null
    this.amountTo = null
    this.amountFrom = null
    this.show = 0
    this.filterBy = null
    this.search()
  }

  onClick(event, row) {
    if (this.visible === event) {
      this.visible = null
    } else {
      this.service.getDetailStatements(row, this.data).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.stmtDetails = result.accountStmtDetail
          this.visible = event
        }
      })
    }
  }

  onHovering(event) {
    //  //
    this.visible = event
  }

  onUnovering(event) {
    this.visible = null
  }

  formatHour(time) {
    if (time) {
      const myRegexp = /\d{2}:\d{2}/g
      const match = myRegexp.exec(time)
      return match[0]
    }
    return ''
  }

  formatDate(time) {
    return time
  }

  getMaxDate() {
    return this.dateTo ? this.dateTo : this.today
  }

  printPdf() {
    this.service
      .getPdf(
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((res) => {
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(JSON.stringify(reader.result))
            this.handleError(output)
          })
          reader.readAsText(res)
        } else {
          this.printFile(res, 'statements.pdf')
        }
      })
  }

  printDetailPdf(row) {
    this.service.getDetailPdf(row, this.data).subscribe((res) => {
      if (res.type == 'text/xml' || res.type == '') {
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
          const output = JSON.parse(JSON.stringify(reader.result))
          this.handleError(output)
        })
        reader.readAsText(res)
      } else {
        this.printFile(res, 'detail-statements.pdf')
      }
    })
  }

  getXlsx() {
    this.service
      .getXlsx(
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((res) => {
        res = new Blob([res], { type: 'application/vnd.ms.excel' })
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(JSON.stringify(reader.result))
            this.handleError(output)
          })
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'statements.xls')
        }
      })
  }

  getPdf() {
    this.service
      .getPdf(
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((res) => {
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(JSON.stringify(reader.result))
            this.handleError(output)
          })
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'statements.pdf')
        }
      })
  }

  getDetailPdf(row) {
    this.service.getDetailPdf(row, this.data).subscribe((res) => {
      if (res.type == 'text/xml' || res.type == '') {
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
          const output = JSON.parse(JSON.stringify(reader.result))
          this.handleError(output)
        })
        reader.readAsText(res)
      } else {
        this.downloadFile(res, 'detail-statements.pdf')
      }
    })
  }

  sendEmail() {
    this.service
      .sendEmail(
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.data,
        this.searchDateFrom,
        this.searchDateTo,
        this.searchAmountTo,
        this.searchAmountFrom,
        this.searchShow,
        this.searchFilterBy,
        this.order,
        this.orderType,
      )
      .subscribe((res) => {
        if (res.errorCode == '0') {
          this.translate.get('public.sendMail').subscribe((value: string) => {
            this.smq.publish('error-mq', value)
          })
        }
      })
  }

  sendDetailEmail(row) {
    this.service.sendDetailEmail(row, this.data).subscribe((res) => {
      if (res.errorCode == '0') {
        this.translate.get('public.sendMail').subscribe((value: string) => {
          this.smq.publish('error-mq', value)
        })
      }
    })
  }

  downloadFile(blob, name) {
    if (blob === null) {
    } else {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
  }

  printFile(blob, name) {
    if (blob === null) {
    } else {
      const doc = blob
      const urlBlob = URL.createObjectURL(blob)
      const url = window.location.href
      const docURL =
        url.replace('#' + this.router.url, '') +
        'viewer/viewer.html?file=' +
        urlBlob
      const x = window.open(docURL)
      x.document.body.onload = () => {
        x.document.addEventListener('pagerendered', () =>
          setTimeout((e) => {
            x.document.getElementById('print').click()
          }, 1000),
        )
      }
    }
  }

  handleError(output) {
    if (typeof output === 'string') {
      output = JSON.parse(output)
    }
    if (output.errorCode && output.errorCode !== '0') {
      let message: string

      if (output.errorCode === '-2') {
        message = 'Following fields contains error:<br/>'
        for (const entry of output.fieldErrors) {
          message =
            message +
            '<b> - Field: ' +
            entry.field +
            ' Error: ' +
            entry.message +
            '</b><br/>'
        }
      } else {
        if (output.errorResponse) {
          if (this.injector.get(TranslateService).currentLang === 'ar') {
            message = output.errorResponse.arabicMessage
          } else {
            message = output.errorResponse.englishMessage
          }
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.subscriptions.push(
        this.translate.get(message).subscribe((value) => {
          this.smq.publish('error-mq', value)
        }),
      )
    }
  }

  private _setaccounts(): void {
    this.accounts = []
    this.selectedUserDataService.getAvailableAccounts().forEach((acc) => {
      this.accounts.push(acc)
    })
    this.selectedAccount = this.accounts.find((a) => {
      return (
        a.fullAccountNumber ===
        this.selectedUserDataService.getModelServiceCurrentAccount()
          .fullAccountNumber
      )
    })
    this.selectedAccount = this.accounts.find((a) => {
      if (this.selectedUserDataService.getModelServiceCurrentAccount()) {
        return (
          a.fullAccountNumber ===
          this.selectedUserDataService.getModelServiceCurrentAccount()
            .fullAccountNumber
        )
      } else {
        return true
      }
    })
  }

  public doChangeAccount(): void {
    this.selectedUserDataService.setModelServiceCurrentAccount(
      this.selectedAccount,
    )
    this.loadAccountData()
    this.search()
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group)
    //this.table.groupHeader.expandAllGroups();
    return ''
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row)
  }

  expandAllTableRows() {
    if (this.table && this.table.rowDetail) {
      this.table.rowDetail.collapseAllRows()
      //this.table.rowDetail.expandAllRows();
    }
  }
}
