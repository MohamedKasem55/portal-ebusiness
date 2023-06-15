import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Account} from "../../../Model/account";
import {Beneficiary} from "../../../Model/beneficiary";
import {Subscription} from "rxjs";
import {RequestValidate} from "../../../Model/requestvalidateType";
import {StaticService} from "../../Common/Services/static.service";
import {TransferWithinService} from "../../Home/Services/transfer-within.service";
import {Exception} from "../../../Model/exception";
import {DecimalPipe} from "@angular/common";

@Component({
    selector: 'app-within-transfer-step4',
    templateUrl: './within-transfer-step4.component.html',
    styleUrls: ['./within-transfer-step4.component.scss']
})
export class WithinTransferStep4Component implements OnInit, OnDestroy {
    @ViewChild('authorization', {static: true}) authorization: any

    @Input() form: FormGroup
    @Input() buttonLabel: string
    @Input() accounts: Account[]
    @Input() beneficiaries: Beneficiary[]
    @Input() confirmSave: any
    @Input() currencies: any
    @Output() onNext = new EventEmitter<boolean>()
    @Output() onInit = new EventEmitter<Component>()
    accountsFrom: any
    totalAmount: number
    mensajeError: any = {}
    subscriptions: Subscription[] = []
    requestValidate: RequestValidate

    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public service: TransferWithinService,
        @Inject(LOCALE_ID) private locale: string,
    ) {
        this.accountsFrom = []
        this.requestValidate = new RequestValidate()
    }

    ngOnInit() {
        this.requestValidate = new RequestValidate()
        this.form.disable()
        this.accountsFrom = this.extractAccountKeyValue(this.accounts)
        this.onInit.emit(this as Component);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (<FormArray>this.form.controls.beneficiaries).controls.forEach(
            (item, i) => {
                this.formatAmount(this.form, i)
            },
        )
    }

    extractAccountKeyValue(account: any) {
        const accountKeyValue = []
        for (let i = 0; account.length > i; i++) {
            accountKeyValue.push({key: i, value: account[i]})
        }
        return accountKeyValue
    }

    onError(error: any) {
        const res = error
        this.mensajeError['code'] = res.error.errorCode
        this.mensajeError['description'] = res.error.errorDescription
    }

    valid() {
        return this.authorization ? this.authorization.valid() : true
    }

    accountFrom21To18(account) {
        let account21 = account
        if (account.length == 21) {
            account21 =
                String(account.substring(0, 5)) +
                '0' +
                String(account.substring(6, 8)) +
                String(account.substring(11, 21))
        }
        return account21
    }

    getLevelMapKey(value: string) {
        return this.confirmSave['mapSecurity'][value.trim()]
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    formatAmount(form: any, i): void {
        if (form.controls.beneficiaries.controls[i].controls.amount.value) {
            const decimalPipe = new DecimalPipe(this.locale)
            form.controls.beneficiaries.controls[i].controls.amount.setValue(
                decimalPipe
                    .transform(
                        form.controls.beneficiaries.controls[i].controls.amount.value,
                        '1.2-6',
                    )
                    .replace(/,/g, ''),
            )
        }
    }

    cancel() {
        this.form.enable()
        this.onNext.emit(false)
    }

    submit() {
        this.subscriptions.push(
            this.service
                .finalizeInit(this.confirmSave, this.requestValidate)
                .subscribe((result: any) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.mensajeError = {}
                        this.onNext.emit(true)
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
}
