import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Exception } from 'app/Application/Model/exception'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { GovernmentRevenueService } from '../../../Services/government-revenue.service'
import { RevenueAccount } from '../../../Model/revenue-account'
import { Account } from 'app/Application/Model/account'
import { DepositorOriginator } from '../../../Model/depositor-originator'
import { CommonWizardComponent } from '../../Common/common-wizard-component'
import { GovRevenueBatchDSO, RevenueDetail } from '../../../Model/gov-revenue-batch'
import { ProcessedOperationService } from '../processed-operation.service'
import { BehaviorSubject } from 'rxjs'
import { StaticService } from 'app/Application/Modules/Common/Services/static.service'
import { distinctUntilChanged } from 'rxjs/operators'
import { ResponseGovRevenueFileDetails } from '../../../Model/gov-rev-detail'
import { GovRevenueFileSubAccounts } from '../../../Model/sub-accounts'

@Component({
    selector: 'app-government-revenue-processed-operation-detail',
    templateUrl: './government-revenue-processed-operation-detail.component.html',
})
export class GovernmentRevenueProcessedOperationDetailComponent
    extends CommonWizardComponent
    implements OnInit {

    private _initialResponse: BehaviorSubject<any> = new BehaviorSubject<any>({})
    govRevenueAccountsList: RevenueAccount[]
    companyDepositorsList: DepositorOriginator[]
    depositorsList: DepositorOriginator[] = []
    accountsList: Account[]
    govRevenueBankCodeList: RevenueAccount[]
    formModel: FormGroup

    initPayment: ResponseGovRevenueFileDetails

    routes: any[] = [['dashboard.payments'],
    ['dashboard.governmentRevenue'],
    ['governmentRevenue.processed_operation', ['/government-revenue/processed-operation']],
    ['governmentRevenue.processed_operations.details']]


    constructor(public fb: FormBuilder,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
        public staticService: StaticService,
        public govRevService: GovernmentRevenueService,
        public listService: ProcessedOperationService,
    ) {
        super(fb, translate, router, staticService, govRevService)
        this.formModel.addControl('bankReference', new FormControl(''))
    }

    ngOnInit() {
        super.ngOnInit()
        const details = this.govRevService.previousPayment
        if (!details) {
            this.back();
        }
        if (details['type'] == 'GF') {
            this.subscriptions.push(this.listService.getInitValues().subscribe((result) => {
                if (result && result.errorCode != '0') {
                    this.back();
                } else {
                    // // -------------------------------------------------
                    this.govRevenueAccountsList = result.govRevenueAccountsList
                    this.accountsList = result.listInitiateAccountDTO
                    this.companyDepositorsList = result.companyDepositors
                    this.depositorsList = result.depositorsList
                    // -------------------------------------------------
                    this.subscriptions.push(
                        this.govRevService
                            .detailFileRequestStatus(details)
                            .subscribe((result) => {
                                if (this.hasError(result)) {
                                    this.onError(result)
                                    return
                                } else {
                                    null
                                    this.initPayment = result;
                                    const paymentDetail = result.batch.details.find(detail => {
                                        return detail.govRevenueFileDetailsPk == details['govRevenueDetailPk']
                                    });
                                    this.initPayment.batch.depositorOriginator = paymentDetail.depositorOriginator;
                                    this.initPayment.batch.beneficiaryOriginator = paymentDetail.beneficiaryOriginator;
                                    this.initPayment.batch.totalAmount = paymentDetail.totalAmount;
                                    this.initPayment.batch.subAccounts = paymentDetail.subAccounts;
                                    this.initPayment.batch.details = null
                                    this.initPayment.batch.bankReference = details.bankReference;
                                    this._initialResponse.next(this.initPayment);
                                }
                            }),
                    )
                }
            }))

        } else {
            this.subscriptions.push(
                this.govRevService
                    .detailRequestStatus(details)
                    .subscribe((result) => {
                        if (this.hasError(result)) {
                            this.onError(result)
                            return
                        } else {
                            this._initialResponse.next(result)
                            this.govRevenueAccountsList = result.govRevenueAccountsList
                            this.accountsList = result.listInitiateAccountDTO
                            this.companyDepositorsList = result.companyDepositors
                            this.depositorsList = result.depositorsList
                        }
                    }),
            )
        }

        this.subscriptions.push(
            this._initialResponse
                .asObservable()
                .pipe(distinctUntilChanged())
                .subscribe((result) => {
                    if (!!result.batch) {
                        this.setFormValues(result.batch)
                        const fields = [
                            'accountFrom',
                            'totalAmount',
                            'beneficiaryBank',
                            'bankReference',
                            'letterNumber',
                            'letterDate',
                            'letterPeriodFrom',
                            'letterPeriodTo',
                            'finclosingyear',
                            'beneficiaryOriginator',
                            'depositorOriginator',
                        ]

                        fields.forEach((field) => {
                            this.formModel.get(field).disable()
                        })
                    }
                }),
        )
    }

    setFormValues(batch: GovRevenueBatchDSO) {
        this.formModel.patchValue(
            {
                accountFrom: batch.accountNumber,
                totalAmount: batch.totalAmount,
                beneficiaryBank: batch.beneficiaryBank,
                bankReference: batch.bankReference,
                letterNumber: batch.letterNumber,
                letterDate: this.setDateFormat((batch.valueDate ? batch.valueDate : batch['letterValueDate'])),
                letterPeriodFrom: this.setDateFormat(batch.letterPeriodFrom),
                letterPeriodTo: this.setDateFormat(batch.letterPeriodTo),
                finclosingyear: batch.finClosingYear,
                beneficiaryOriginator: batch.beneficiaryOriginator,
                depositorOriginator: batch.depositorOriginator,
            },
            { onlySelf: true, emitEvent: false },
        )
        this.removeSubAccountAmount()
        if (batch.details != null) {
            batch.details.forEach((revenueDetail: RevenueDetail) => {
                this.addSubAccountAmount(revenueDetail)
            })
        } else {
            batch.subAccounts.forEach((subAccount: GovRevenueFileSubAccounts) => {
                this.addSubAccountAmount(null, subAccount)
            })
        }
    }

    addSubAccountAmount(revenueDetail?: RevenueDetail, subAccount?: GovRevenueFileSubAccounts) {
        this.subAccountAmounts.push(
            this.fb.group({
                revenueAccountPk: [
                    revenueDetail != null ? revenueDetail.revenueAccount.govRevenueAccountPk : subAccount.govRevenueFileSubAccountsPk,
                    [Validators.required],
                ],
                detail: [
                    revenueDetail != null ? revenueDetail.revenueAccount.revenueAccountName : subAccount.name,
                ],
                amount: [
                    revenueDetail != null ? revenueDetail.amount : subAccount.amount,
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                        Validators.min(0),
                    ],
                ],
            }),
        )
    }

    setDateFormat(value: string) {

        const dateParts = value.trim().split('-')
        const date = {
            day: dateParts[2],
            month: dateParts[1],
            year: dateParts[0],
        }

        return date

    }

    refreshData() {
        super.refreshData();
    }

    back() {
        this.router.navigate(['/government-revenue/processed-operation'])
    }

    isDisabled() {
        throw new Error('Method not implemented.')
    }
    valid() {
        throw new Error('Method not implemented.')
    }
    next() {
        throw new Error('Method not implemented.')
    }
}
