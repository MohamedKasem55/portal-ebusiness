import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable'
import { BehaviorSubject, Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { Account } from '../../../Model/account'
import { PagedData } from '../../../Model/paged-data'
import { CurrentAccountsService } from '../accounts-current-account/accounts-current-account.service'
import { AccountsCaAccountService } from '../Services/accounts-ca-account.service'

@Component({
  templateUrl: './account-preferences.component.html',
  styleUrls: ['./account-preferences.component.scss'],
  selector: 'app-account-preferences',
})
export class AccountPreferences
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  // public step: number;
  public loading: boolean
  public accountBalancePage: PagedData<Account>
  public pageLimit = 20
  public currentPage = 0
  public isConfirming = false

  private _order: string
  private _orderType: string
  private _txType = 'ECIA'
  private _step: BehaviorSubject<number> = new BehaviorSubject<number>(1)
  sortmulti = SortType.multi

  @ViewChild('accountBalanceCertificateTable')
  table: DatatableComponent
  currentPageElemnscount: number = this.pageLimit

  private _originalAccounts: Account[] = []
  public modifiedAccounts: Account[] = []

  constructor(
    private _currentAccountsService: CurrentAccountsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private _caAccountsService: AccountsCaAccountService,
  ) {
    super()
  }

  public ngOnInit() {
    this._loadAccounts()
    this.subscriptions.push(
      this._step
        .asObservable()
        .pipe(distinctUntilChanged())
        .subscribe((step) => {
          if (step === 2) {
            this.currentPageElemnscount = this.modifiedAccounts.length
          } else if (step === 1) {
            this.currentPageElemnscount =
              typeof this.table !== 'undefined' &&
              this.table.rowCount > this.pageLimit
                ? this.accountBalancePage.data.length
                : this.pageLimit
          }
        }),
    )
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  get step() {
    return this._step.getValue()
  }

  private _loadAccounts(): void {
    this._caAccountsService
      .getAllAccounts(this._order, this._orderType, 1, 100, this._txType)
      .subscribe((res) => {
        this._originalAccounts = []
        this.accountBalancePage = res
        this._replaceNullAccountAliasWithEmptyString(
          this.accountBalancePage.data,
        )
        this.accountBalancePage.data.forEach((a) =>
          this._originalAccounts.push({ ...a }),
        )
        this.currentPageElemnscount =
          typeof this.table !== 'undefined' &&
          this.table.rowCount > this.pageLimit
            ? this.accountBalancePage.data.length
            : this.pageLimit
        // this.currentPageElemnscount = (typeof this.table === 'undefined' || this.table.rowCount <= this.pageLimit) ? this.pageLimit : this.accountBalancePage.data.length;
      })
  }

  private _replaceNullAccountAliasWithEmptyString(accounts: Account[]): void {
    accounts.forEach((a) =>
      a.alias === null ? (a.alias = '') : (a.alias = a.alias),
    )
  }

  public canEditNickName(): boolean {
    return this.authenticationService.activateOption(
      'AccountsNickName',
      [],
      ['AccountNicknameGroup'],
    )
  }

  public checkForm(): void {
    this._currentAccountsService
      .sendNicknameUpdate(this.modifiedAccounts)
      .subscribe(
        (res) => {
          this._step.next(3)
        },
        (err) => {
          this.resetStepper()
        },
      )
  }

  public resetStepper(): void {
    this.goBack()
    this._loadAccounts()
  }

  public goBack(): void {
    this.isConfirming = false
    this.currentPage = 0
    this._step.next(1)
  }

  public isValid(): boolean {
    let isValid = false
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.accountBalancePage.data.length; i++) {
      const originalAccount = this._originalAccounts.find(
        (original) =>
          original.fullAccountNumber ===
          this.accountBalancePage.data[i].fullAccountNumber,
      )
      if (this.accountBalancePage.data[i].alias !== originalAccount.alias) {
        isValid = true
        break
      }
    }
    return isValid
  }

  public nicknameChanged(fullAccountNumber: string): boolean {
    const originalAccount = this._originalAccounts.find(
      (original) => original.fullAccountNumber === fullAccountNumber,
    )
    const modifiedAccount = this.accountBalancePage.data.find(
      (modified) => modified.fullAccountNumber === fullAccountNumber,
    )
    return originalAccount.alias !== modifiedAccount.alias
  }

  private _fillModifiedAccounts(): void {
    this.modifiedAccounts = []
    this.accountBalancePage.data.forEach((account) => {
      if (this.nicknameChanged(account.fullAccountNumber)) {
        this.modifiedAccounts.push(account)
      }
    })
  }

  public nextStep(): void {
    this.isConfirming = true
    this.currentPage = 0
    this._fillModifiedAccounts()
    this._step.next(2)
  }

  onPage(event) {
    const t = this.table
    if (+t['rowCount'] > event.pageSize * (event.offset + 1)) {
      this.currentPageElemnscount = event.pageSize
    } else {
      this.currentPageElemnscount =
        +t['rowCount'] - +event['pageSize'] * +event['offset']
    }
  }

  modifyPageLimit(event) {
    this.currentPageElemnscount =
      this.table.rowCount <= this.pageLimit
        ? this.table.rowCount
        : this.pageLimit
  }
}
