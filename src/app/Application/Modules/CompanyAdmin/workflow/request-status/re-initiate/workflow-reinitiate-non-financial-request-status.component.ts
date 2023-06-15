import { Component, Inject, Injector, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { WorkflowReInitiateNonFinancialRequestStatusService } from "./workflow-reInitiate-non-financial-request-status.service";
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { WorkflowNonFinancialRequestStatusService } from '../../../Services/workflow/request-status/workflow-non-financial-request-status.service';
import { AuthenticationService } from 'app/core/security/authentication.service';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { NonFinancialReinitiateStep1Component } from './non-financial-reinitiate-step1.component';
import { NonFinancialReinitiateStep2Component } from './non-financial-reinitiate-step2.component';
import { Exception } from 'app/Application/Model/exception';
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type';
import { NonFinancialReinitiateStep3Component } from './non-financial-reinitiate-step3.component';

@Component({
    selector: 'app-workflow-reinitiate-non-financial-request-status',
    templateUrl: './workflow-reinitiate-non-financial-request-status.component.html',
    styleUrls: ['./workflow-reinitiate-non-financial-request-status.component.scss']
})
export class WorkflowReinitiateNonFinancialRequestStatusComponent extends AbstractAppComponent
    implements OnInit, OnDestroy {
    @ViewChild(NonFinancialReinitiateStep1Component)
    step1: NonFinancialReinitiateStep1Component
    @ViewChild(NonFinancialReinitiateStep2Component)
    step2: NonFinancialReinitiateStep2Component
    @ViewChild(NonFinancialReinitiateStep3Component)
    step3: NonFinancialReinitiateStep3Component

    selectedItem: any
    step: number
    form: FormGroup
    formModify: FormGroup
    formModel: FormGroup
    accountSelected: any
    data = {}
    reInitiateData: any
    workflowTypePaymentList: any[] = []
    validationResponse: any = {}
    requestValidate: RequestValidate
    entityProperties: any[] = []
    confirmResponse: any = {}
    combosData: any = {};
    action: string;
    generateChallengeAndOTP: ResponseGenerateChallenge

    routes: any[] = [
        ['companyAdmin.companyAdmin'],
        ['workflow.workflow', ['/companyadmin/workflow']],
        ['workflow.requestStatus.requestStatus', ['/companyadmin/workflow/requestStatus']],
        ['workflow.requestStatus.reInitiateNonFinancial'],
    ]

    constructor(
        public reInitiateService: WorkflowReInitiateNonFinancialRequestStatusService,
        public detailsService: WorkflowNonFinancialRequestStatusService,
        public fb: FormBuilder,
        public translate: TranslateService,
        public staticService: StaticService,
        public authenticationService: AuthenticationService,
        public router: Router,
        protected injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
    ) {
        super(translate)
        this.step = 1
        this.requestValidate = new RequestValidate()
        this.formModel = this.fb.group({})
    }

    ngOnInit() {
        this.selectedItem = this.detailsService.getSelectedItem()
        if (!this.selectedItem || !this.selectedItem['batchPk']) {
            this.router.navigate([this.getBackRequestStatus()])
        } else {
            this.reInitiateData = Object.assign({}, this.selectedItem)
            this.entityProperties = this.reInitiateService.configureReinitiateFormModel(
                this.reInitiateData,
            )
            if (this.entityProperties) {
                this.entityProperties.forEach((element) => {
                    if (
                        element.isFormField === true &&
                        this.formModel.controls[element.key.toString()]
                    ) {
                        this.formModel.controls[element.key.toString()].setValue(
                            this.reInitiateData[element.key.toString()],
                        )
                    }
                })
                this.entityProperties.forEach((element) => {
                    if (
                        element.updatable === false &&
                        element.isFormField &&
                        this.formModel.controls[element.key.toString()]
                    ) {
                        this.formModel.controls[element.key.toString()].disable()
                    }
                })
                this.formModel.updateValueAndValidity()
            }
        }
    }

    nextStep() {
        this.step = ++this.step % 4
        if (this.step === 0) {
            this.step = 1
        }
        this.scrollToTop()
    }
    executeAction(action: string): void {

        switch (action) {

            case 'details':
                break;
            case 'delete':
                this.action = 'delete';
                this.next()
                break;
            case 'reInitiate':
                this.action = 'reinitiate';
                this.next()
                break;
        }
    }
    previous() {
        this.step = --this.step % 4
        if (this.step === 0) {
            this.step = 1
        }
        this.scrollToTop()
    }

    finish() {
        this.step = 1
        this.router.navigate(['/companyadmin/workflow'])
    }

    ngOnDestroy() {
        super.ngOnDestroy()
    }

    getBackRequestStatus(){
        return '/companyadmin/workflow/requestStatus';
    }

    getBackUrl() {
        this.router.navigate(['/companyadmin/workflow/requestStatus']);
    }

    isPending(): boolean {
        return false;
    }

    next() {
        switch (this.step) {
            case 1:
                if (this.action === "delete") {
                    this.nextStep()
                } else {
                    this.validateAccountRules(this.workflowTypePaymentList)
                }
                break
            case 2:
                if (this.action === "delete") {
                    this.deleteRequest(this.step2.selectedItem)
                    this.nextStep()
                } else {
                    this.confirmAccountRules(this.workflowTypePaymentList)
                }
                break;
            case 3:
                this.finish()
                break
        }
    }

    validateAccountRules(workflowTypePaymentList) {
        this.reInitiateService
            .validate(workflowTypePaymentList)
            .subscribe((response: any) => {
                if (
                    response.hasOwnProperty('error') &&
                    (response as any).error instanceof Exception
                ) {
                    this.onError(response)
                    return
                } else {
                    this.validationResponse = response
                    this.nextStep()
                    return
                }
            })
    }

    confirmAccountRules(workflowTypePaymentList) {
        this.reInitiateService
            .confirm(
                this.validationResponse)
            .subscribe((response: any) => {
                if (
                    response.hasOwnProperty('error') &&
                    (response as any).error instanceof Exception
                ) {
                    this.onError(response)
                    return
                } else {
                    this.confirmResponse = response
                    this.generateChallengeAndOTP = this.confirmResponse.generateChallengeAndOTP;
                    this.nextStep()
                    return
                }
            })
    }
    deleteRequest(accountRules) {
        this.reInitiateService.deleteConfirmRequest(accountRules).subscribe((result: any) => {
            const body = result
            if (
                body.errorCode != '0'
            ) {
                this.onError(body)
                return
            } else {
                this.confirmResponse = result;
            }
        })
    }
}
