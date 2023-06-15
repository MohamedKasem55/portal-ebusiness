import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {Subscription} from 'rxjs'
import {PendingActionsNotificaterService} from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import {BulkPaymentService} from './bulk-payment.service'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {
    WorkflowDetailsPopupComponent,
    WORKFLOWS_BY_PENDING_ACTION_MAP,
    PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
    selector: 'app-bulk-payments',
    templateUrl: './bulk-payments.component.html',
    styleUrls: ['./bulk-payments.component.scss'],
})
export class BulkPaymentsComponent implements OnInit {
    wizardStep: number
    sharedData: any = {}
    rejectReason: any
    currentComponent: any

    authorizeSubscription: Subscription

    constructor(
        public service: BulkPaymentService,
        public router: Router,
        private pendingActionNotification: PendingActionsNotificaterService,
    ) {
    }

    ngOnInit() {
    }

    componentAdded(component) {
        this.currentComponent = component
        component.sharedData = this.sharedData
        this.wizardStep = component.step

        if (component.step !== 1) {
            if (Object.keys(this.sharedData).length === 0) {
                this.router.navigate(['/myprofile/pending/bulkpayments/step1'])
            }
        }
    }

    approveFirstStep() {
        this.sharedData.bulkPaymentsBatchDTO = null;
        this.sharedData.responseValidate = {}
        if (this.sharedData.tableSelected.length > 0) {
            this.authorizeSubscription = this.service
                .authorizeValidate(this.sharedData.tableSelected)
                .subscribe((result) => {
                    if (!result.error) {
                        this.sharedData.responseValidate = result

                        this.sharedData.aproveFlow = true
                        //console.log(this.sharedData);
                        this.router.navigate(['/myprofile/pending/bulkpayments/step2'])
                    }
                    this.authorizeSubscription.unsubscribe()
                })
        }
    }

    rejectFirstStep() {
        this.sharedData.bulkPaymentsBatchDTO = null;
        this.sharedData.responseValidate = {}
        this.sharedData.aproveFlow = false
        this.rejectReason = ''
        this.router.navigate(['/myprofile/pending/bulkpayments/step2'])
    }

    onItemDetailBackButtonClicked() {
        this.sharedData.bulkPaymentsBatchDetail = null;
    }

    backButton() {
        this.wizardStep--
        this.router.navigate([
            '/myprofile/pending/bulkpayments/step' + this.wizardStep,
        ])
    }

    confirmAprove() {
        //console.log(this.sharedData);
        if (this.sharedData.tableSelected.length > 0) {
            this.authorizeSubscription = this.service
                .authorizeConfirm(
                    this.sharedData.responseValidate.batchListsContainerDTO,
                    this.sharedData.requestValidate,
                )
                .subscribe((result) => {
                    if (!result.error) {
                        this.sharedData.validation = result

                        this.sharedData['confirm'] = result
                        this.pendingActionNotification.getRefreshObserver().next(true)
                        this.router.navigate(['/myprofile/pending/bulkpayments/step3'])
                    } else {
                        this.sharedData.validateResponse.generateChallengeAndOTP =
                            result.generateChallengeAndOTP

                        this.sharedData.requestValidate = new RequestValidate()
                    }
                    this.authorizeSubscription.unsubscribe()
                })
        }
    }

    confirmReject() {
        if (this.sharedData.tableSelected.length > 0) {
            this.authorizeSubscription = this.service
                .refuseConfirm(
                    this.sharedData.tableSelected,
                    this.sharedData.rejectReason,
                )
                .subscribe((result) => {
                    if (!result.error) {
                        this.sharedData['confirm'] = null
                        //
                        this.pendingActionNotification.getRefreshObserver().next(true)
                        this.router.navigate(['/myprofile/pending/bulkpayments/step3'])
                    }
                    this.authorizeSubscription.unsubscribe()
                })
        }
    }

    isValid() {
        return !this.currentComponent.valid() //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
    }

    displayWorkflowDetails(popup) {
        ;(popup as WorkflowDetailsPopupComponent).openModal(
            WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.BULK_PAYMENTS),
            PENDING_ACTION.BULK_PAYMENTS,
        )
    }
}
