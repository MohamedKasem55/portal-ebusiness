import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {TransferOwnService} from "../../Transfers/Services/transfer-own.service";
import {ModelPipe} from "../../../Components/common/Pipes/model-pipe";
import {DecimalPipe} from "@angular/common";
import {RequestValidate} from "../../../Model/requestvalidateType";

@Component({
    selector: 'app-quick-own-transfer-step3',
    templateUrl: './quick-own-transfer-step3.component.html',
    styleUrls: ['./quick-own-transfer-step3.component.scss']
})
export class QuickOwnTransferStep3Component implements OnInit,OnDestroy {

    @Input() form: FormGroup
    @Input() buttonLabel: string
    @Input() valuesForm: any
    @Input() selectedAccountFrom: any
    @Input() selectedAccountTo: any
    @Input() accountsFrom: any
    @Input() accountsTo: any
    @Input() reasons: any
    @Input() amount2: any
    @Input() exchangeRate: any
    @Input() currencies: any
    @Input() step3Object: any;
    @Output() onNext = new EventEmitter<boolean>()
    @Output() onInit = new EventEmitter<Component>()
    exchangeRateInquired: any
    amountIn: any
    subscriptions: Subscription[] = []
    OWN = 'owerTransfer'
    selectedCurrenciesList: any;
    selectedCurrency: any;
    inqRatesRes: any;
    indicativeAmountCurrency: string;
    checkAndSeparateInitiationPermission: any;
    requestValidate = new RequestValidate()
    ownTransferValidateResponse: any

    constructor(
        private fb: FormBuilder,
        public service: TransferOwnService,
        @Inject(LOCALE_ID) private locale: string,
        private pipemModel: ModelPipe
    ) {

    }

    createStep3OwnForm() {
        if (
            this.form.controls.operationType.value == this.OWN &&
            !this.form.controls.accountFrom
        ) {
            this.form.addControl(
                'accountFrom',
                new FormControl({value: '', disabled: true}, Validators.required),
            );
            this.form.addControl(
                'accountTo',
                new FormControl({value: '', disabled: true}, Validators.required),
            );
            this.form.addControl(
                'amount',
                new FormControl(
                    {
                        value: '',
                        disabled: true,
                    },
                    Validators.compose([
                        Validators.required,
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                    ]),
                ),
            );
            this.form.addControl(
                'additional1',
                new FormControl({value: '', disabled: true}),
            );
            this.form.addControl('currency', new FormControl(''));
            this.form.addControl('amountIn', new FormControl(''));
            this.form.addControl('exchangeRate', new FormControl(''));
            this.form.get('amountIn').disable();
            this.form.get('exchangeRate').disable();
            // @ts-ignore
            this.form.controls['currency'].disable(true);
        }
    }

    ngOnInit() {
        //console.log('emit init 3');
        this.createStep3OwnForm();
        this.form.patchValue(this.valuesForm);
        this.formatAmount();
        this.onInit.emit(this as Component);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.ownTransferValidateResponse = this.step3Object.validate
        this.selectedCurrenciesList = this.step3Object.selectedCurrenciesList;
        if (!this.step3Object.selectedCurrency.currency) {
            const currency = this.step3Object.selectedCurrency;
            this.selectedCurrency = {};
            this.selectedCurrency['currency'] = currency;
        } else {
            this.selectedCurrency = this.step3Object.selectedCurrency;
        }
        this.form.controls['currency'].patchValue(this.selectedCurrency);
        this.selectedCurrenciesList = this.selectedCurrenciesList.filter((curr) => curr === this.selectedCurrency.currency);
        if (this.step3Object.validate && this.step3Object.validate.inqRates) {
            this.indicativeAmountCurrency =
                (this.step3Object.validate.currencyDealt === this.step3Object.validate.toCurrency)
                    ? this.step3Object.validate.fromCurrency : this.step3Object.validate.toCurrency;
            this.amountIn = this.step3Object.validate.inqRates.contraAmt + " " + this.indicativeAmountCurrency;
            (this.step3Object.validate) ? this.inqRatesRes = this.step3Object.validate.inqRates : this.inqRatesRes = null;
            this.exchangeRateInquired = this.step3Object.validate.inqRates.rate;
        }
        if(this.step3Object.validate.checkAndSeparateInitiationPermission){
            this.checkAndSeparateInitiationPermission = this.step3Object.validate.checkAndSeparateInitiationPermission;
        }
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

    submit() {
        const dealCurrency = this.pipemModel.transform('currencyIso', this.form.get('currency').value.currency);
        this.subscriptions.push(
            this.service
                .add(
                    this.selectedAccountFrom.value,
                    this.selectedAccountTo.value,
                    this.valuesForm.additional1,
                    dealCurrency,
                    Number.parseFloat(this.form.get('amount').value),
                    this.checkAndSeparateInitiationPermission,
                    this.inqRatesRes,
                    this.requestValidate
                )
                .subscribe((result) => {
                    if (result === null) {

                    } else {
                        this.onNext.emit(true)
                        //console.log('submit 3');
                    }
                }),
        )
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
}
