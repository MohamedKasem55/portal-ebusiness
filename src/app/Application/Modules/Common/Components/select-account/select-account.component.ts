import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    LOCALE_ID,
    OnInit,
    OnChanges,
    Output,
    ViewChild
} from '@angular/core';
import {AccountBalanceService} from "../../../Home/Services/account-balance-service";
import {CurrentAccountsService} from "../../../Accounts/accounts-current-account/accounts-current-account.service";
import {Account} from "../../../../Model/account";
import {TranslateService} from "@ngx-translate/core";
import {AmountCurrencyPipe} from "../../../../Components/common/Pipes/amount-currency.pipe";

@Component({
    selector: 'app-select-account',
    templateUrl: './select-account.component.html',
    styleUrls: ['./select-account.component.scss'],
    providers: [AccountBalanceService, CurrentAccountsService]
})
export class SelectAccountComponent implements AfterViewInit, OnInit, OnChanges  {
    @Input() headerText: string
    selectedAccount: Account
    @Input()
    inputAccount: Account

    @Input() selectedFullAccountNumber: string
    @Output() selectedFullAccountNumberChange = new EventEmitter<string>()

    @Input() accounts: Account[] = []
    @Input() useOldDesign: boolean = true;
    @Input() isDisabled: boolean = false;
    @Input() logo: string
    @Input() defaultOption = {key: "MY Key", value: 331263}
    @Input() clearable: boolean = true
    @Output() onAccountChange = new EventEmitter<Account>();
    @Output() onScrollToEnd = new EventEmitter<Account>();
    language: string;
    @Input() getAllAccounts = false;

    constructor(
        public accountBalanceService: AccountBalanceService,
        public currentAccountsService: CurrentAccountsService,
        public translate: TranslateService,
        private injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
        private cdr: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        this.changeAccount();
        this.language = this.translate.currentLang;
        this.translate.onLangChange.subscribe((lang: any) => {
            this.language = lang.lang;
        })
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    getAccounts() {
        this.accountBalanceService
            .getAccounts('ECAL')
            .subscribe((result) => {
                if (result) {
                    this.accounts = result
                }
            })
    }

    formatAccount(account: Account) {
        return account['fullAccountNumber'] + ' - ' + (account['alias'] ? (account['alias'] + ' - ') : '') +
            (new AmountCurrencyPipe(this.injector, this._locale).transform(account['availableBalance'])) + ' ' +
            this.currentAccountsService.transformComboValue('currencyIso', account['currency'])
    }

    changeAccount() {
        if (this.selectedFullAccountNumber && this.accounts) {
            const index = this.accounts.findIndex(account => account.fullAccountNumber == this.selectedFullAccountNumber)
            this.onAccountChange.emit(this.accounts[index])
            this.selectedFullAccountNumberChange.emit(this.selectedFullAccountNumber)
        } else if (this.accounts) {
            this.selectedFullAccountNumber = this.accounts[0] ? this.accounts[0].fullAccountNumber : ''
            this.onAccountChange.emit(this.accounts[0] ? this.accounts[0] : new Account())
            this.selectedFullAccountNumberChange.emit(this.selectedFullAccountNumber)
        }
    }

    ngOnChanges(): void {
        this.selectedAccount = this.inputAccount;
        if (this.getAllAccounts) {
            this.getAccounts();
        }
    }


    scrollToEnd(event) {
        this.onScrollToEnd.emit(event)
    }
}
