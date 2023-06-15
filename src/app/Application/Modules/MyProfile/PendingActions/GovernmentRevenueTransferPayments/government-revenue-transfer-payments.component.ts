import {DetailComponent} from './components/detail/detail.component'
import {Component, OnDestroy, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {Subscription} from 'rxjs'
import {GovernmentRevenueTransferPaymentsService} from './government-revenue-transfer-payments.service'
import {PendingActionsNotificaterService} from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {
    WorkflowDetailsPopupComponent,
    WORKFLOWS_BY_PENDING_ACTION_MAP,
    PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'
import {AbstractAppComponent} from "../../../Common/Components/Abstract/abstract-app.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-government-revenue-transfer-payments',
    templateUrl: './government-revenue-transfer-payments.component.html',
    styleUrls: ['./government-revenue-transfer-payments.component.scss'],
})
export class GovernmentRevenueTransferPaymentsComponent extends AbstractAppComponent implements OnInit, OnDestroy {

    wizardStep: number

    sharedData: any = {
        isDetailActivated: false,
        approveFlow: false,
        authorizeValidate: null,
        generateChallengeAndOTP: null,
        rejectedReason: null,
        validation: null,
        govRevTransPayTableSelected: [],
        govRevFileTransPayTableSelected: []
    }

    currentComponent: any

    constructor(
        public service: GovernmentRevenueTransferPaymentsService,
        public router: Router,
        public translate: TranslateService,
        private pendingActionNotification: PendingActionsNotificaterService,
    ) {
        super(translate)
    }

    ngOnInit() {
        super.ngOnInit();
        setTimeout(() => {
            this.sharedData['isDetailActivated'] = false;
        }, 200);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    componentAdded(component) {
        this.currentComponent = component
        component.sharedData = this.sharedData
        this.wizardStep = component.step
        if (component.step !== 1) {
            if (Object.keys(this.sharedData).length === 0) {
                setTimeout(() => {
                    this.sharedData['isDetailActivated'] = false;
                }, 200);
                this.router.navigate([
                    '/myprofile/pending/government-revenue-transfer-payments/step1',
                ])
            }
        }
    }

    isDisabled(action: string) {
        switch (action) {
            case 'approve':
            case 'reject':
                return this.sharedData.govRevTransPayTableSelected.length == 0
                    && this.sharedData.govRevFileTransPayTableSelected.length == 0;
            case 'confirm':
                if (this.wizardStep == 2 && !this.sharedData.approveFlow) {
                    return false;
                }
                if (this.wizardStep == 2 && this.sharedData.approveFlow) {
                    return !this.isValid();
                }
                return
            default:
                break;
        }
        return false;
    }

    onApproveGoToValidate() {
        this.sharedData['isDetailActivated'] = false;
        this.sharedData.authorizeValidate = {}
        this.subscriptions.push(
            this.service
                .authorizeValidate(
                    this.sharedData.govRevTransPayTableSelected,
                    this.sharedData.govRevFileTransPayTableSelected,
                )
                .subscribe((result) => {
                    if (!result.error) {
                        this.sharedData.approveFlow = true
                        this.sharedData.authorizeValidate = result
                        this.sharedData.generateChallengeAndOTP = result.generateChallengeAndOTP
                        this.sharedData.rejectedReason = null
                        this.router.navigate([
                            '/myprofile/pending/government-revenue-transfer-payments/step2',
                        ])
                    }
                })
        )
    }

    onRejectGoToValidate() {
        this.sharedData['isDetailActivated'] = false;
        this.sharedData.approveFlow = false
        this.sharedData.authorizeValidate = null
        this.sharedData.generateChallengeAndOTP = null
        this.sharedData.rejectedReason = null

        this.router.navigate([
            '/myprofile/pending/government-revenue-transfer-payments/step2',
        ])
    }

    onApproveGoToConfirm() {
        this.sharedData['isDetailActivated'] = false;
        this.subscriptions.push(this.service
            .approveConfirm(
                this.sharedData.authorizeValidate.batchList,
                this.sharedData.authorizeValidate.batchFileList,
                this.sharedData.requestValidate,
            )
            .subscribe((result) => {
                if (!result.error) {
                    this.sharedData.validation = result
                    //console.log(this.sharedData.validation);
                    this.pendingActionNotification.getRefreshObserver().next(true)
                    this.router.navigate([
                        '/myprofile/pending/government-revenue-transfer-payments/step3',
                    ])
                } else {
                    this.sharedData.generateChallengeAndOTP = result.generateChallengeAndOTP
                    this.sharedData.requestValidate = new RequestValidate()
                }
            })
        )
    }

    onRejectGoToConfirm() {
        this.sharedData['isDetailActivated'] = false;
        this.subscriptions.push(this.service
            .refuseConfirm(
                this.sharedData.govRevTransPayTableSelected,
                this.sharedData.govRevFileTransPayTableSelected,
                this.sharedData.rejectedReason)
            .subscribe((result) => {
                if (!result.error) {
                    this.sharedData.validation = result
                    this.pendingActionNotification.getRefreshObserver().next(true)
                    this.router.navigate([
                        '/myprofile/pending/government-revenue-transfer-payments/step3',
                    ])
                }
            })
        )
    }

    backFromDetailButton() {
        this.sharedData['isDetailActivated'] = false;
        this.sharedData.govRevTransPayTableSelected = [];
        this.sharedData.govRevFileTransPayTableSelected = [];
        this.router.navigate([
            '/myprofile/pending/government-revenue-transfer-payments/step1',
        ]).then();
    }

    backButton() {
        this.sharedData['isDetailActivated'] = false;
        this.wizardStep--;
        this.router.navigate([
            '/myprofile/pending/government-revenue-transfer-payments/step' +
            this.wizardStep,
        ])
    }

    isValid() {
        return this.currentComponent.valid()
        //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
    }

    displayWorkflowDetails(popup) {
        const workflowComponent = popup as WorkflowDetailsPopupComponent
        if (this.currentComponent instanceof DetailComponent) {
            const tableSelected = this.sharedData.govRevTransPayTableSelected
            if (!!tableSelected && tableSelected.length > 0) {
                workflowComponent.setAccount(tableSelected[0].accountNumber)
            }
        }
        workflowComponent.openModal(
            WORKFLOWS_BY_PENDING_ACTION_MAP.get(
                PENDING_ACTION.GOVERNMENT_REVENUE_TRANSFER,
            ),
            PENDING_ACTION.GOVERNMENT_REVENUE_TRANSFER,
        )
    }
}
