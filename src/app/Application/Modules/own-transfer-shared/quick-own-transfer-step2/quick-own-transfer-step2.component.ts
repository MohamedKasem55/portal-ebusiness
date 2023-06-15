import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    LOCALE_ID, OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ExchangeRateResponse} from "../../../Model/ExchangeRateResponse";
import {NgSelectComponent} from "@ng-select/ng-select";
import {TransferOwnService} from "../../Transfers/Services/transfer-own.service";
import {StaticService} from "../../Common/Services/static.service";
import {StorageService} from "../../../../core/storage/storage.service";
import {ModelPipe} from "../../../Components/common/Pipes/model-pipe";
import {DecimalPipe} from "@angular/common";
import {OwnTransferValidate} from "../../Transfers/Model/own-transfer-validate";

@Component({
    selector: 'app-quick-own-transfer-step2',
    templateUrl: './quick-own-transfer-step2.component.html',
    styleUrls: ['./quick-own-transfer-step2.component.scss']
})
export class QuickOwnTransferStep2Component implements OnInit, OnChanges {
    @Input() form: FormGroup;
    @Input() buttonLabel: string;
    @Input() selectedAccount: any;
    @Input() show: boolean;
    @Output() onNext = new EventEmitter<boolean>();
    @Output() onInit = new EventEmitter<Component>();
    @Output() sharedObject = new EventEmitter<any>();
    accountFromSelected: string;
    loading = false;
    accountsFrom: any[];
    accountsTo: any[];
    reasons: any;
    realTransferLimit: number;
    transferLimit: number
    selectedAccountFrom: any;
    accountToSelected: any;
    amount2: any;
    exchangeRate: any;
    currencies = [];
    combosSolicitados = ['currencyIso'];
    subscriptions: Subscription[] = [];
    OWN = 'owerTransfer';
    selectedCurrencies: any[] = [];
    selectedDealCurrency: any;
    amountInSourceAccount: any;
    currentSegmentation: any;
    exchangeRateResponse: ExchangeRateResponse;
    amountIn: any
    exchangeRateInquired: any
    accountsToBeforeFilter: any;
    isSarSourceDestination: boolean;
    selectedCurrency: any = "";
    selectedCurrencyStep3: any;
    @ViewChild(NgSelectComponent)
    ngSelect: NgSelectComponent;
    public generateChallengeAndOTP;

    constructor(
        public service: TransferOwnService,
        public staticService: StaticService,
        public fb: FormBuilder,
        @Inject(LOCALE_ID) private locale: string,
        private storeservice: StorageService,
        private pipemModel: ModelPipe,
        private cd: ChangeDetectorRef
    ) {
        //this call is made to ensure the existence of the currency props
        this.pipemModel.transform('currencyType','');
        this.currentSegmentation = this.storeservice.retrieve('welcome').segment;
        this.accountsFrom = [];
        this.accountsTo = [];
    }


    ngOnInit() {
        this.createStep2OwnForm();
        this.subscriptions.push(
            this.service.limit().subscribe((result) => {
                if (result === null) {
                    this.onError()
                } else {
                    this.realTransferLimit = result.transferLimit
                    this.transferLimit = result.transferLimit
                    this.accountsFrom = this.extractAccountKeyValue(result.accountList)
                    this.accountsToBeforeFilter = result.accountListTo;
                    this.accountsTo = this.extractAccountKeyValue(result.accountListTo)
                    this.changeCurrencyFormValidation(this.isDifferentCurrencyAccountsSelected());
                    this.form.controls['amount'].setValidators([
                        Validators.required,
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                        Validators.min(0),
                        Validators.max(result.transferLimit),
                    ])
                    if (this.selectedAccount) {
                        this.form.controls['accountFrom'].patchValue(
                            this.getKeyAccount(this.selectedAccount),
                        )
                    }
                    this.subscriptions.push(
                        this.form.controls['accountFrom'].valueChanges.subscribe(
                            (values) => {
                                if (values) {
                                    if (this.realTransferLimit) {
                                        this.transferLimit =
                                            this.realTransferLimit >
                                            this.accountsFrom[values].value.availableBalance
                                                ? this.accountsFrom[values].value.availableBalance
                                                : this.realTransferLimit
                                    } else {
                                        this.transferLimit =
                                            this.accountsFrom[values].value.availableBalance
                                    }
                                    this.form.controls['amount'].setValidators([
                                        Validators.required,
                                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                                        Validators.min(0),
                                        Validators.max(this.transferLimit),
                                    ])
                                    this.form.controls['amount'].updateValueAndValidity()
                                }
                            },
                        ),
                    )
                }
            }),
        )

        //console.log('emit init 2');
        this.onInit.emit(this as Component)

        this.formatAmount()
    }

    ngOnChanges(): void {
        if (this.form.controls['accountFrom'] &&
            this.form.controls['accountTo']) {
            this.accountFromSelected = this.form.controls['accountFrom'].value;
            this.accountToSelected = this.form.controls['accountTo'].value;
            this.selectedCurrencyStep3 = this.form.controls['currency'].value;
            this.isDifferentCurrencyAccountsSelected();

        }
    }

    getKeyAccount(account: any) {
        if (account) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.accountsFrom.length; i++) {

                if (
                    this.accountsFrom[i].value.fullAccountNumber ==
                    account.fullAccountNumber
                ) {
                    return this.accountsFrom[i].key
                }
            }
        }
        return
    }

    extractAccountKeyValue(account: any) {
        const accountKeyValue = []
        for (let i = 0; account.length > i; i++) {
            accountKeyValue.push({key: i, value: account[i]})
        }
        return accountKeyValue
    }

    onError() {
        this.loading = false
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    cancel() {
        this.onNext.emit(false)
    }


    createStep2OwnForm() {
        if (
            this.form.controls.operationType.value == this.OWN &&
            !this.form.controls.accountFrom
        ) {

            this.form.addControl(
                'accountFrom',
                new FormControl('', Validators.required),
            );
            this.form.addControl(
                'accountTo',
                new FormControl('', Validators.required),
            );
            this.form.addControl(
                'currency',
                new FormControl(''),
            );
            this.form.addControl(
                'amount',
                new FormControl(
                    {value: '', disabled: true},
                    Validators.compose([
                        Validators.required,
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                    ]),
                ),
            );
            this.form.addControl('additional1', new FormControl(''));
            this.form.addControl('amountIn', new FormControl(''));
            this.form.addControl('exchangeRate', new FormControl(''));
            this.form.get('amountIn').disable();
            this.form.get('exchangeRate').disable();
            this.form.get('currency').disable();

            this.form.setValidators(
                this.accountsValidations('accountFrom', 'accountTo'),
            );
        }
    }

    accountsValidations(accountFrom, accountTo) {
        return (group: FormGroup): any => {
            const accountSelectFrom = group.controls[accountFrom]
            const accountSelectTo = group.controls[accountTo]
            if (
                accountSelectFrom.value &&
                accountSelectTo.value &&
                this.accountsFrom[accountSelectFrom.value].value.fullAccountNumber ===
                this.accountsTo[accountSelectTo.value].value.fullAccountNumber
            ) {
                return {notSameAccount: true}
            }
            if (
                accountSelectFrom.value &&
                this.accountsFrom[accountSelectFrom.value].value.availableBalance <= 0
            ) {
                return {balance0: true}
            }
        }
    }

    accountSelected(selectedSourceIndex: any) {
        this.accountFromSelected = selectedSourceIndex;
        this.onSourceAccountChange(selectedSourceIndex);
        this.changeCurrencyFormValidation(this.isDifferentCurrencyAccountsSelected());
    }

    getFormValidationErrors() {
        Object.keys(this.form.controls).forEach((key) => {
            const controlErrors = this.form.get(key).errors
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(() => {
                })
            }
        })
    }

    formatAmount(): void {
        if (this.form.get('amount').value) {
            const decimalPipe = new DecimalPipe(this.locale)
            this.form
                .get('amount')
                .setValue(
                    decimalPipe
                        .transform(this.form.get('amount').value, '1.2-6')
                        .replace(/,/g, ''),
                )
        }
    }

    enableAmount(event) {
        this.changeCurrencyFormValidation(false);
        this.accountToSelected = event;
        if (this.isAccountsSelected()) {
            this.form.get('amount').reset();
            this.form.get('amount').enable()
            return true
        } else {
            this.form.get('amount').disable()
            return false
        }
    }

    /**
     *
     * @description Check If the account form and account to are different
     * @returns boolean
     * */
    isDifferentCurrencyAccountsSelected(): boolean {
        if (this.isAccountsSelected()) {
            if ((this.accountsFrom && this.accountsFrom.length > 0) &&
                (this.accountsFrom[this.form.controls['accountFrom'].value].value.currency !==
                    this.accountsTo[this.form.controls['accountTo'].value].value.currency)) {
                this.selectedCurrencies = [];
                this.selectedCurrencies.push(this.accountsTo[this.form.controls['accountTo'].value].value.currency);
                this.selectedCurrencies.push(this.accountsFrom[this.form.controls['accountFrom'].value].value.currency);
                this.isSarSourceDestination = false;
                if (this.selectedCurrencyStep3) {
                    this.selectedCurrency = this.selectedCurrencyStep3;
                    this.form.controls['currency'].patchValue(this.pipemModel.transform('currencyType', this.selectedCurrencyStep3.currency));
                    this.selectedDealCurrency = this.selectedCurrencyStep3;
                    this.cd.detectChanges();
                }
                return true;
            } else {
                this.selectedCurrencies = [];
                this.form.controls['currency'].setValidators([]);
                this.form.controls['currency'].updateValueAndValidity();
                this.isSarSourceDestination = true;
                this.form.get("currency").setValue('');
                if(this.accountsTo[this.form.controls['accountTo'].value]) {
                    this.selectedCurrencies.push(this.accountsTo[this.form.controls['accountTo'].value].value.currency);
                    const currency = this.pipemModel.transform('currencyType', this.accountsTo[this.form.controls['accountTo'].value].value.currency);
                    this.selectedDealCurrency = this.accountsTo[this.form.controls['accountTo'].value].value.currency;
                    this.form.controls['currency'].patchValue(currency);
                }
                return false;
            }
        }
    }

    /**
     * @description Checks the if the accountTo an accountFrom is not empty
     * @returns boolean
     * */
    isAccountsSelected(): boolean {
        return this.form.get('accountFrom').value !== '' &&
            this.form.get('accountFrom').value !== undefined &&
            this.form.get('accountFrom').value !== null &&
            this.form.get('accountTo').value !== '' &&
            this.form.get('accountTo').value !== undefined &&
            this.form.get('accountTo').value !== null
    }

    /**
     * @description On change To be sent currency
     * @returns void
     * */
    currencySelected(selectedCurrency): void {
        this.selectedDealCurrency = selectedCurrency;
    }

    /**
     *@description On Amount change
     *@returns void
     * */
    onAmountChange(): void {
        if (this.form.get("amount").valid) {
            this.changeCurrencyFormValidation(this.isDifferentCurrencyAccountsSelected());
        }
    }

    /**
     * @description On change of source account apply some business validation
     * @case1 SAR (Show all accounts in destination list)
     * @case2 FX currency show only same currency and SAR
     *
     * @param selectedSourceIndex
     *@return void
     * */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/explicit-module-boundary-types
    onSourceAccountChange(selectedSourceIndex: any) {
        const selectedSourceCurrency = this.accountsToBeforeFilter[selectedSourceIndex];
        if (selectedSourceCurrency && selectedSourceCurrency.currency !== "608") {
            this.accountsTo = this.accountsToBeforeFilter.filter(
                (item) => item.currency === "608" || item.currency === selectedSourceCurrency.currency
            );
            this.form.get('accountTo').reset();

            this.accountsTo = this.extractAccountKeyValue(this.accountsTo);
        } else {
            this.accountsTo = this.extractAccountKeyValue(this.accountsToBeforeFilter);
        }
    }

    changeCurrencyFormValidation(showCurrency: boolean): void {
        if (showCurrency) {
            this.form.controls['currency'].setValidators([Validators.required]);
            this.form.controls['currency'].updateValueAndValidity();
            this.form.get("currency").enable()
        } else {
            this.form.controls['currency'].setValidators([]);
            this.form.controls['currency'].updateValueAndValidity();
            this.form.get("currency").disable();
        }
    }

    submit() {
        this.selectedAccountFrom =
            this.accountsFrom[this.form.controls['accountFrom'].value];
        this.accountToSelected =
            this.accountsTo[this.form.controls['accountTo'].value];

        const obj = new OwnTransferValidate();
        obj.amount = Number.parseFloat(this.form.controls['amount'].value);
        obj.accountDTOTo = this.accountToSelected.value;
        obj.accountDTOFrom = this.selectedAccountFrom.value;
        obj.remarks = this.form.controls['additional1'].value;
        if (this.selectedDealCurrency.currency) {
            obj.dealCurrency = this.pipemModel.transform('currencyIso', this.selectedDealCurrency.currency);
        }else{
            obj.dealCurrency = this.pipemModel.transform('currencyIso', this.accountsFrom[this.form.controls['accountFrom'].value].value.currency);
        }
        obj.segment = this.currentSegmentation;

        this.subscriptions.push(
            this.service.valid(obj)
                .subscribe((result) => {
                    if (result === null) {
                        this.onError()
                    } else {
                        this.exchangeRate = result.exchangeRate
                        this.amount2 = result.amount2;
                        const sharedObject = {
                            validate: result,
                            selectedCurrenciesList: this.selectedCurrencies,
                            selectedCurrency: this.selectedDealCurrency
                        };
                        this.generateChallengeAndOTP = result.generateChallengeAndOTP
                        this.sharedObject.emit(sharedObject);
                        this.onNext.emit(true)
                    }
                }),
        )
    }
}
