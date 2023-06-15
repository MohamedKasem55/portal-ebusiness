import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { Account } from '../../../Model/account'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { AccountListComponent } from '../../shared/account-list/account-list.component'
import { SelectedDataService } from '../Services/selected-data-service'
import { CurrentAccountsService } from './accounts-current-account.service'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  templateUrl: './accounts-current-account.component.html',
})

// Component class
export class AccountsCurrentAccountComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('accountBalanceTable', { static: false }) table: any
  destroy$: Subject<boolean> = new Subject<boolean>()

  @ViewChild(AccountListComponent)
  DataTableAccount: AccountListComponent

  accountBalancePage: PagedData<Account>
  order: string
  orderType: string
  loading: boolean
  txType = 'ECAL'
  cicNumber: string
  totalBalance: string
  currencies: any[]
  branchs: any[]
  subscription: Subscription
  isSearchCollapsed = true
  public accounts: Account[] = []
  //Variables estáticas para el hardcodeo de datos
  accountNumber: string
  balance: string
  unclearedBalance: string

  combosSolicitados = ['currencyIso', 'currency', 'branchRbs5']

  accountNumberFilter = ''
  accountNicknameFilter = ''
  currencyFilter = ''
  branchFilter = ''
  isSearch = false

  constructor(
    public service: CurrentAccountsService,
    public dataService: SelectedDataService,
    public router: Router,
    public storage: StorageService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,

    public translate: TranslateService,
  ) {
    super()
    this.accountBalancePage = new PagedData<Account>()
    this.accountBalancePage.page.pageSize = 20
    this.order = ''
    this.orderType = ''
  }

  setPage(dataTableEvent) {
    //console.log(dataTableEvent)
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
          this.onError(result)
        } else {
          this.loading = false
          this.accountBalancePage = result
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

  private _setaccounts(): void {
    this.accounts = []
    this.dataService.getAvailableAccounts().forEach((acc) => {
      this.accounts.push(acc)
    })
  }
  onChangeSize(event) {
    this.accountBalancePage.page.size = event
    this.setPage(null)
  }

  public setSort(dataTableEvent: any): void {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }
    const property =
      dataTableEvent.column.prop === 'fullAccountNumber'
        ? 'accountPk'
        : dataTableEvent.column.prop

    this.accountBalancePage.page.pageNumber = 0
    this.loading = true
    const filters = this.getFilters()
    // Service Call with new short
    this.subscription = this.service
      .getResults(
        property,
        this.orderType,
        this.accountBalancePage.page.pageNumber + 1,
        this.accountBalancePage.page.pageSize,
        this.txType,
        filters,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.accountBalancePage = result
        }

        this.subscription.unsubscribe()
      })
  }

  onError(result) {
    //console.log(result);
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this._setaccounts()
    this.refreshData()
    this.setPage(null)
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.refreshData()
      })
  }

  refreshData() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comboData) => {
        const data: any = comboData
        this.currencies =
          data[this.combosSolicitados.indexOf('currency')]['values']
        this.branchs =
          data[this.combosSolicitados.indexOf('branchRbs5')]['values']
      })
  }

  details(acc: string) {
    //console.log(this.accountBalancePage);
    const property =
      this.order === 'fullAccountNumber' ? 'accountPk' : this.order
    const filters = this.getFilters()
    this.service
      .getResults(property, this.orderType, 1, 100, this.txType, filters)
      .subscribe((result) => {
        this.dataService.setAvailableAccounts(result.data)
        for (let i = this.accountBalancePage.data.length - 1; i >= 0; i--) {
          if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
            this.dataService.setModelServiceCurrentAccount(
              this.accountBalancePage.data[i],
            )
            this.router.navigate(['/accounts/onlineStatements'])
          }
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe()
  }

  tranfers(acc: string) {
    for (let i = this.accountBalancePage.data.length - 1; i >= 0; i--) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/transfers/transfers'])
      }
    }
  }

  payroll(acc: string) {
    for (let i = this.accountBalancePage.data.length - 1; i >= 0; i--) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/payroll/payroll-options'])
      }
    }
  }

  billPayment(acc: string) {
    for (let i = this.accountBalancePage.data.length - 1; i >= 0; i--) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/payments/billPayments'])
      }
    }
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
  searchAccounts(): void {
    this.isSearch = true
    this.setPage(null)
  }

  getFilters() {
    const filters = {
      accountNickname: this.accountNicknameFilter,
      accountNumber: this.accountNumberFilter,
      branchid: this.branchFilter,
      currency: this.currencyFilter,
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

  createNewAccount() {
    this.router.navigate(['/accounts/openAdditionalAccount'])
  }
  isAllowed() {
    return this.authenticationService.userHasAnyGroup(['CompanyAdmins'])
  }
}
