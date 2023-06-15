import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account} from "../../../Model/account";
import {Beneficiary} from "../../../Model/beneficiary";
import {ConfirmWithinSave} from "../../Home/Model/confirm-save-within";
import {Subscription} from "rxjs";
import {StaticService} from "../../Common/Services/static.service";
import {TransferWithinService} from "../../Home/Services/transfer-within.service";
import {Exception} from "../../../Model/exception";
import {BeneficiaryService} from "../../Transfers/Services/beneficiary.service";

@Component({
    selector: 'app-within-transfer-step3',
    templateUrl: './within-transfer-step3.component.html',
    styleUrls: ['./within-transfer-step3.component.scss']
})
export class WithinTransferStep3Component implements OnInit, OnDestroy {
    @Input() form: FormGroup
    @Input() buttonLabel: string
    @Input() accounts: Account[]
    @Input() transferLimit: number
    @Input() beneficiaries: Beneficiary[]
    @Input() beneficiariesService: BeneficiaryService;
    @Output() onNext = new EventEmitter<boolean>()
    @Output() onInit = new EventEmitter<Component>()
    @Input() selectedAccount: Account
    transfersLimit: any = []
    confirmSave: ConfirmWithinSave
    accountsFrom: any
    reasons: any
    currencies = []
    combosSolicitados = ['TransferReasonType', 'currencyIso']
    mensajeError: any = {}
    subscriptions: Subscription[] = []
    presetAccountKey: any
    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public service: TransferWithinService,
    ) {
        this.accountsFrom = []
        this.reasons = []
    }

    ngOnInit() {
        this.subscriptions.push(
            this.staticService
                .getAllCombos(this.combosSolicitados)
                .subscribe((comboData) => {
                    const data = comboData
                    const valores =
                        data[this.combosSolicitados.indexOf('TransferReasonType')]['values']
                    Object.keys(valores).map((key, index) => {
                        this.reasons.push({key, value: valores[key]})
                    })
                    this.currencies =
                        data[this.combosSolicitados.indexOf('currencyIso')]['values']
                }),
        )
        this.accountsFrom = this.extractAccountKeyValue(this.accounts)
        this.presetAccountKey = this.getKeyAccount(this.selectedAccount)

        if ((this.form.controls['beneficiaries'] as FormArray).length <= 0 || (this.form.controls['beneficiaries'] as FormArray).length !== this.beneficiaries.length) {

            this.form.controls['beneficiaries'].reset()
            this.form.controls.beneficiaries['controls'] = []
            for (let i = 0; i < this.beneficiaries.length; i++) {

                this.initFormTransferBeneficiaries(
                    this.form,
                    this.beneficiaries[i],
                )
            }
        }
        this.onInit.emit(this as Component)
    }

    getKeyAccount(account: any) {
        if (account) {
            // tslint:disable-next-line:prefer-for-of
            for (const formItem of this.accountsFrom) {
                if (
                    formItem.value.fullAccountNumber ==
                    account.fullAccountNumber
                ) {
                    return formItem.key
                }
            }
        }
        return
    }
    initFormTransferBeneficiaries(form, data) {
        form.controls['beneficiaries'].push(
            this.fb.group({
                accountFrom: ['', Validators.required],
                accountTo: [
                    {value: data.beneficiaryAccountCode, disabled: true},
                    Validators.required,
                ],
                amount: [
                    {value: '', disabled: true},
                    [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(this.transferLimit),
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                    ],
                ],
                email: [{value: data.email, disabled: true}],
                additional1: [''],
            }),
        )
        const indice = form.controls['beneficiaries'].length - 1
        const beneficiarios =
            form.controls['beneficiaries'].controls[indice].controls
        this.subscriptions.push(
            beneficiarios['accountFrom'].valueChanges.subscribe((_values) => {
                if (this.transferLimit) {
                    this.transfersLimit[indice] =
                        this.transferLimit >
                        this.accountsFrom[_values].value.availableBalance
                            ? this.accountsFrom[_values].value.availableBalance
                            : this.transferLimit
                } else {
                    this.transfersLimit[indice] =
                        this.accountsFrom[_values].value.availableBalance
                }

                beneficiarios['amount'].setValidators([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.transfersLimit[indice]),
                    Validators.pattern('^[0-9]*.?[0-9]*$'),
                ])
                beneficiarios['amount'].updateValueAndValidity()
            }),
        )
    }

    getFormValidationErrors() {
        Object.keys(this.form.controls).forEach((key) => {
            const controlErrors = this.form.get(key).errors
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach((keyError) => {
                    //TO REVIEW
                })
            }
        })
    }

    extractAccountKeyValue(account: any) {
        const accountKeyValue = []
        for (let i = 0; account.length > i; i++) {
            accountKeyValue.push({key: i, value: account[i]})
        }
        return accountKeyValue
    }

    removeTransfer(i) {
        this.beneficiaries.splice(i, 1);
        this.beneficiariesService.selectedWithinBeneficiaries = this.beneficiaries;

        (<FormArray>this.form.controls.beneficiaries).removeAt(i)
    }



    cancel() {
        this.onNext.emit(false)
    }

    submit() {
        //this.subscriptions.push(this.service.validate().subscribe( resultValidate => {
        //	if(resultValidate["errorCode"] == "0"){
        this.subscriptions.push(
            this.service
                .confirmInit(
                    this.beneficiaries,
                    this.form.value.beneficiaries,
                    this.accounts,
                )
                .subscribe((result) => {
                    if (
                        result.hasOwnProperty('error') &&
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        (<any>result).error instanceof Exception
                    ) {
                        this.onError(result)
                        return
                    } else {
                        this.confirmSave = result
                        this.confirmSave['batchList'] = this.extractBatch(
                            result['checkAndSeparateInitiatitionPermission'],
                        )
                        this.confirmSave['mapSecurity'] = this.generateLevelsMap(
                            this.confirmSave['batchList'],
                        )
                        this.confirmSave['generateChallengeAndOTP'] =
                            result['generateChallengeAndOTP']
                        this.mensajeError = {}
                        this.onNext.emit(true)
                    }
                }),
        )
        //    }
        //}));
        //this.onNext.emit(true);
    }

    generateLevelsMap(batches) {
        const map = {}
        for (const batch of batches) {
            map[(String(batch.accountNumber) + '-' + String(batch.accountTo)).trim()] =
                batch.futureSecurityLevelsDTOList
        }
        return map
    }

    extractBatch(batchList) {
        const list: any = []
        for (const notAllowed of batchList.notAllowed) {
            list.push(batchList);
        }
        for (const toProcess of batchList.toProcess) {
            list.push(toProcess);
        }
        for (const toAuthorize of batchList.toAuthorize) {
            list.push(toAuthorize);
        }
        return list;
    }

    onError(error: any) {
        const res = error
        this.mensajeError['code'] = res.error.errorCode
        this.mensajeError['description'] = res.error.errorDescription
    }

    enableAmount(form: any, i) {
        if (
            form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
            '' &&
            form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
            undefined &&
            form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
            null
        ) {
            form.controls.beneficiaries.controls[i].controls.amount.enable();
            return true;
        } else {
            form.controls.beneficiaries.controls[i].controls.amount.disable();
            return false;
        }
    }


    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }
}
