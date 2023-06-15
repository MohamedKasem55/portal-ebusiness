import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { PagedData } from 'app/Application/Model/paged-data'
import { Page } from 'app/Application/Model/page'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { SelectedDataService } from 'app/Application/Modules/Accounts/Services/selected-data-service'
import { Account } from 'app/Application/Model/account'
import { AccountBalanceService } from '../../Services/account-balance-service'
import { CurrentAccountsService } from 'app/Application/Modules/Accounts/accounts-current-account/accounts-current-account.service'
import { StaticService } from 'app/Application/Modules/Common/Services/static.service'
import { takeUntil } from 'rxjs/operators'
import { Subject, Subscription } from 'rxjs'

export const ALL_CURRENCIES = '001'
export const ALL_BRANCHES = '00000'

@Component({
  selector: 'app-manage-accounts-widget',
  templateUrl: './manage-accounts-widget.component.html',
  styleUrls: ['./manage-accounts-widget.component.scss'],
  providers: [CurrentAccountsService],
})
export class ManageAccountsWidgetComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Output() onUpdateAccounts: EventEmitter<Account[]> = new EventEmitter<
    Account[]
  >()
  selectedAccounts: Account[] = []
  totalAccounts: Account[] = []

  @ViewChild('accountsModal', { static: true }) accountsModal: ModalDirective
  @ViewChild('pageTable', { static: false }) table: any
  menuTitles: string[] = []
  pageData: PagedData<any>
  tableSelectedRows: any = []
  selectable = true
  accounts: Account[] = []
  accountBalancePage: PagedData<Account>
  combosSolicitados = ['currencyIso', 'currency', 'branchRbs5']
  currencies: any[]
  branchs: any[]
  destroy$: Subject<boolean> = new Subject<boolean>()
  accountNumberFilter = ''
  accountNicknameFilter = ''
  currencyFilter = ''
  branchFilter = ''
  isSearch = false
  order: string
  orderType: string
  subscription: Subscription
  sub2: Subscription
  sub3: Subscription
  txType = 'ECAL'
  loading: boolean
  isCollapsedContent = true

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public dataService: SelectedDataService,
    public accountBalanceService: AccountBalanceService,
    public service: CurrentAccountsService,
    public staticService: StaticService,
  ) {
    super()
    this.accountBalancePage = new PagedData<Account>()
    this.accountBalancePage.page.pageSize = 20
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.initializeMenuTitles()
    this.refreshData()
    // this.setPage(null);
  }

  setPageAccountBalance(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.accountBalanceService
      .getResults(
        '',
        '',
        pageInfo.offset,
        this.accountBalancePage.page.pageSize,
        'ECAL',
      )
      .subscribe((pagedData) => {
        this.dataService.setAvailableAccounts(pagedData.data)
        this.tableSelectedRows = pagedData.data[0]
        this.accountBalancePage = pagedData
        this._setaccounts()
      })
  }

  refreshData() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comboData) => {
        const data = comboData
        this.currencies =
          data[this.combosSolicitados.indexOf('currency')]['values']
        this.branchs =
          data[this.combosSolicitados.indexOf('branchRbs5')]['values']
      })
  }

  private _setaccounts(): void {
    this.accounts = []
    this.dataService.getAvailableAccounts().forEach((acc) => {
      this.accounts.push(acc)
    })
  }

  setPage(dataTableEvent) {
    if (dataTableEvent === null) {
      dataTableEvent = { offset: 0 }
      this.accountBalancePage.page.pageNumber = dataTableEvent.offset
    }
    const property =
      this.order === 'fullAccountNumber' ? 'accountPk' : this.order

    this.loading = true

    this.accountBalancePage.page.pageNumber =
      dataTableEvent.offset !== undefined
        ? dataTableEvent.offset
        : dataTableEvent.pageNumber

    const filters = this.getFilters()
    // Service Call
    this.subscription = this.service
      .getResults(
        property,
        this.orderType,
        +this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.txType,
        filters,
      )
      .subscribe((result) => {
        if (result === null) {
          // Controlar el caso de error serivicio Accounts
          // this.onError(result)
        } else {
          this.loading = false
          this.accountBalancePage = result
          this.accountBalancePage.data = [...this.accountBalancePage.data]
          const customerName =
            typeof result['customerName'] !== 'undefined'
              ? result['customerName']
              : ''
          this.dataService.setCustomerName(customerName)
          localStorage.setItem(
            'response',
            JSON.stringify(this.accountBalancePage),
          )
        }

        this.subscription.unsubscribe()
      })
  }

  onSelectAccountMenuItem(event) {
    this.getTotalAccounts()
    this.getSelectedAccounts()
  }

  initializeMenuTitles() {
    this.menuTitles.push('dashboard.manageAccounts')
  }

  reset() {
    this.accountNumberFilter = ''
    this.accountNicknameFilter = ''
    this.currencyFilter = ''
    this.branchFilter = ''
    this.order = ''
    this.orderType = ''
    this.isSearch = false
    this.setPage(null)
  }

  getFilters() {
    const filters = {
      accountNickname: this.accountNicknameFilter,
      accountNumber: this.accountNumberFilter,
      branchid: this.branchFilter !== ALL_BRANCHES ? this.branchFilter : '',
      currency:
        this.currencyFilter !== ALL_CURRENCIES ? this.currencyFilter : '',
      search: this.isSearch,
    }
    const data = {}
    Object.keys(filters).map((key) => {
      if (filters[key] != '' && filters[key] != null) {
        data[key] = filters[key]
      }
    })
    return data
  }

  onChangeSize(event) {
    this.accountBalancePage.page.size = event
    this.setPage(null)
  }

  searchAccounts(): void {
    this.isSearch = true
    this.setPage(null)
  }

  rowIdentity(row) {
    return row.accountPk
  }

  saveUserAccounts() {
    const updatedAccounts = this.totalAccounts.map((account) => {
      if (this.isSelectedAccount(account)) {
        account = { ...account, dashboard: true }
      } else {
        account = { ...account, dashboard: false }
      }
      return account
    })
    this.sub3 = this.accountBalanceService
      .saveUserAccounts(updatedAccounts)
      .subscribe((res) => {
        this.onUpdateAccounts.emit(this.selectedAccounts)
        this.accountsModal.hide()
      })
  }

  isSelectedAccount(account: Account) {
    return this.selectedAccounts.some(
      (acc) => acc.accountPk === account.accountPk,
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  selectAll() {
    if (this.allPageSelected()) {
      // Deselect all
      this.deselectAllPage()
    } else {
      // Select all
      this.selectAllPage()
    }
  }

  private deselectAllPage(): void {
    this.accountBalancePage.data.forEach((row) => {
      const found = this.selectedAccounts.find(
        (selectedAccount) => selectedAccount.accountPk === row.accountPk,
      )
      if (found) {
        this.selectedAccounts.splice(this.selectedAccounts.indexOf(found), 1)
      }
    })
    this.selectedAccounts = [...this.selectedAccounts]
  }

  private selectAllPage(): void {
    this.deselectAllPage()
    this.accountBalancePage.data.forEach((row) => {
      this.selectedAccounts.push(row)
    })
    this.selectedAccounts = [...this.selectedAccounts]
  }

  public allPageSelected(): boolean {
    let found = true

    for (let row of this.accountBalancePage.data) {
      found = this.selectedAccounts.some(
        (acc) => acc.accountPk === row.accountPk,
      )
      if (!found) {
        break
      }
    }
    return found
  }

  getSelectedAccounts() {
    this.accountBalanceService
      // Get all selected accounts
      .getUserAccounts('', '', 0, undefined, 'ECAL')
      .subscribe((pagedData) => {
        this.selectedAccounts = pagedData.data
        this.loading = false
        // this.selectedAccounts = []
        this.accountsModal.show()
      })
  }

  getTotalAccounts() {
    this.accountBalanceService
      // Get all accounts from a company
      .getResults('', '', 0, undefined, 'ECAL')
      .subscribe((res) => {
        this.dataService.setAvailableAccounts(res.data)

        this.totalAccounts = res.data
        this.accountBalancePage.data = res.data
        // Hacemos una paginacion inicial de 20
        const pageObject = new Page()
        pageObject.pageNumber = res.page.pageNumber
        pageObject.pageSize = this.accountBalancePage.page.pageSize
        pageObject.size = this.accountBalancePage.page.pageSize
        pageObject.totalElements = res.page.totalElements
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize
        this.accountBalancePage.page = pageObject
      })
  }
}
