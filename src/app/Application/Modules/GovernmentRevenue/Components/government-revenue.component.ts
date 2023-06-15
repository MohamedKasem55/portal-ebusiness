import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from '../../../Model/exception'
import { StaticService } from '../../Common/Services/static.service'
import { CommonWizardComponent } from './Common/common-wizard-component'
import { GovRevenueBatchDSO } from '../Model/gov-revenue-batch'
import { RevenueAccount } from '../Model/revenue-account'
import { GovernmentRevenueService } from '../Services/government-revenue.service'
import { PendingActionsNotificaterService } from '../../Common/Components/PendingActions/pending-actions-notificater.service'

@Component({
    selector: 'app-government-revenue',
    templateUrl: './government-revenue.component.html',
})
export class GovernmentRevenueComponent
    extends CommonWizardComponent
    implements OnInit, OnDestroy {
    view: ViewType
    ViewType = ViewType

    previousBatch: GovRevenueBatchDSO

    constructor(
        public fb: FormBuilder,
        public translate: TranslateService,
        public router: Router,
        public govRevService: GovernmentRevenueService,
        public staticService: StaticService,
        private pendingActionNotification: PendingActionsNotificaterService,
    ) {
        super(fb, translate, router, staticService, govRevService)
        this.view = ViewType.NEW
    }

    ngOnInit() {
        super.ngOnInit()
        const previousPayment = this.govRevService.previousPayment
        if (previousPayment) {
            this.view = ViewType.FROM_PREVIOUS
            this.loadFromPrevious(previousPayment)
        } else {
            this.view = ViewType.NEW
            this.loadInit()
        }
    }

    loadInit() {
        this.subscriptions.push(
            this.govRevService.initNewPayment().subscribe((result) => {
                if (this.hasError(result)) {
                    this.onError(result)
                    return
                } else {
                    this.govRevenueAccountsList = result.govRevenueAccountsList
                    this.accountsList = result.listInitiateAccountDTO
                    this.companyDepositorsList = result.companyDepositors
                }
            }),
        )
    }

    loadFromPrevious(previous: GovRevenueBatchDSO) {
        this.subscriptions.push(
            this.govRevService.initFromPrevious(previous).subscribe((result) => {
                if (this.hasError(result)) {
                    this.onError(result)
                    return
                } else {
                    this.previousBatch = result.batch
                    this.govRevenueAccountsList = result.govRevenueAccountsList
                    this.accountsList = result.listInitiateAccountDTO
                    this.companyDepositorsList = result.companyDepositors
                    this.depositorsList = result.depositorsList
                    this.setFormValues(this.previousBatch)
                }
            }),
        )
    }

    ngOnDestroy() {
        super.ngOnDestroy()
    }

    buildRequestValidate(): any {
        const detailList = []
        for (const control of this.subAccountAmounts.controls) {
            const amount: number = +control.get('amount').value
            const revenueAccountPk = control.get('revenueAccountPk').value
            const revAccount: RevenueAccount = this.govRevenueAccountsList.find(
                (value) => value.govRevenueAccountPk == revenueAccountPk,
            )
            const revenueDetail = {
                amount,
                revenueAccount: revAccount,
            }
            detailList.push(revenueDetail)
        }

        const closingDate = this.formModel.get('finclosingyear').value
        return {
            accountNumber: this.formModel.get('accountFrom').value,
            beneficiaryBank: this.formModel.get('beneficiaryBank').value,
            beneficiaryOriginatorSelected: this.formModel.get('beneficiaryOriginator')
                .value,
            depositorOriginatorSelected: this.formModel.get('depositorOriginator')
                .value,
            finclosingyear: this.govRevService.dateFormatter.format(closingDate),
            letterNumber: this.formModel.get('letterNumber').value,
            letterperiodfrom: this.govRevService.dateFormatter.format(
                this.formModel.get('letterPeriodFrom').value,
            ),
            letterperiodto: this.govRevService.dateFormatter.format(
                this.formModel.get('letterPeriodTo').value,
            ),
            totalAmount: +this.formModel.get('totalAmount').value,
            valueDate: this.govRevService.dateFormatter.format(
                this.formModel.get('letterDate').value,
            ),
            details: detailList,
        }
    }

    next() {
        this.pageErrorMessage = null
        switch (this.wizardStep) {
            case 1:
                this.subscriptions.push(
                    this.govRevService
                        .validateNewPayment(this.buildRequestValidate())
                        .subscribe((result) => {
                            if (this.hasError(result)) {
                                this.onError(result)
                                return
                            } else {
                                this.validationResponse = result
                                this.markNextWizardStep()
                            }
                        }),
                )
                break
            case 2:
                this.subscriptions.push(
                    this.govRevService
                        .confirmNewPayment(
                            this.validationResponse.batch,
                            this.requestValidate,
                        )
                        .subscribe((result) => {
                            if (this.hasError(result)) {
                                this.onError(result)
                                return
                            } else {
                                this.confirmResponse = result
                                this.pendingActionNotification.getRefreshObserver().next(true)
                                this.markNextWizardStep()
                            }
                        }),
                )
                break
        }
    }

    isDisabled() {
        return !(
            (this.wizardStep == 1 && this.formModel && this.formModel.valid) ||
            (this.wizardStep == 2 && this.validAuthorization())
        )
    }

    finish() {
        switch (this.view) {
            case ViewType.NEW:
                this.clearForm()
                this.wizardStep = 1
                break
            case ViewType.FROM_PREVIOUS:
                this.back()
                break
        }
    }

    valid() {
        return true
    }

    back() {
        this.router.navigate(['/government-revenue/previous-payments'])
    }

    get securityLevelsDTOList(): any {
        if (
            this.wizardStep == 2 &&
            this.validationResponse &&
            this.validationResponse.batch
        ) {
            return this.validationResponse.batch.futureSecurityLevelsDTOList
        }
        return null
    }
}

export enum ViewType {
    NEW = 'newPayment',
    FROM_PREVIOUS = 'fromPrevious',
}
