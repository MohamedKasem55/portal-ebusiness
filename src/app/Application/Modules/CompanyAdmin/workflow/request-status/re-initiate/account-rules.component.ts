import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { AccountRulesReinitiateStep1Component } from './account-rules-step1.component'
import { AccountRulesReinitiateStep2Component } from './account-rules-step2.component'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component'
import { Exception } from 'app/Application/Model/exception'
import { AccountRulesService } from '../../../Services/workflow/account-rules/account-rules.service'
import { WorkflowAccountsRequestStatusService } from '../../../Services/workflow/request-status/workflow-accounts-request-status.service'
import { WorkflowReInitiateAccountRequestStatusService } from './workflow-reInitiate-account-request-status.service'

@Component({
    selector: 'app-rules',
    templateUrl: './account-rules.component.html',
})
export class AccountRulesReinitiateComponent extends AbstractAppComponent
    implements OnInit {
    @ViewChild(AccountRulesReinitiateStep1Component)
    step1: AccountRulesReinitiateStep1Component
    @ViewChild(AccountRulesReinitiateStep2Component)
    step2: AccountRulesReinitiateStep2Component

    step: number
    form: FormGroup
    formModify: FormGroup
    formModel: FormGroup
    accountSelected: any
    data = {}
    messageError = {}
    workflowTypePaymentList: any[] = []

    validationResponse: any = {}
    requestValidate: RequestValidate
    confirmResponse: any = {}
    selectedItem: any;
    initialsData: any;
    reInitiateData: any
    entityProperties: any[] = []
    companyPrivileges: any;
    combosKey: any = [];
    combosData: any = {};
    action: string;

    routes: any[] = [
        ['companyAdmin.companyAdmin'],
        ['workflow.workflow', ['/companyadmin/workflow']],
        ['workflow.requestStatus.requestStatus', ['/companyadmin/workflow/requestStatus']],
        ['workflow.requestStatus.reInitiateAccount'],
    ]

    constructor(
        public router: Router,
        public services: AccountRulesService,
        public fb: FormBuilder,
        public translate: TranslateService,
        public detailsService: WorkflowAccountsRequestStatusService,
        public reInitiateService: WorkflowReInitiateAccountRequestStatusService,
    ) {
        super(translate)
        this.step = 1
        this.requestValidate = new RequestValidate()
        this.formModify = this.fb.group({
            accountNumber: [''],
            accountRules: new FormArray([]),
        })
        this.formModel = this.fb.group({})
    }

    ngOnInit() {
        super.ngOnInit()
        this.selectedItem = this.detailsService.getSelectedItem()
        if (!this.selectedItem || !this.selectedItem['batchPk']) {
            this.router.navigate([this.getBackUrl()])
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

    next() {
        switch (this.step) {
            case 1:

                const accountControl = (this.form.controls['accountRules'] as FormArray)
                this.data = this.step1.accountRules
                this.fillFormModify(this.data, accountControl)
                this.formModify.controls.accountNumber.patchValue(
                    this.step1.accountRules.accountNumber,
                )
                this.accountSelected = this.step1.accountRules.accountNumber
                this.workflowTypePaymentList = this.modifyRules(
                    this.data,
                    this.formModify,
                )
                if (this.action === "delete") {
                    this.nextStep()
                } else {
                    this.validateAccountRules(this.workflowTypePaymentList)
                }
                break
            case 2:
                if (this.action === "delete") {
                    this.deleteRequest(this.workflowTypePaymentList[0])
                } else {
                this.workflowTypePaymentList = this.modifyRules(
                    this.data,
                    this.formModify,
                )
                this.confirmAccountRules(this.workflowTypePaymentList)
                }
                break;
            case 3:
                this.finish()
                break
        }
    }

    nextStep() {
        this.step = ++this.step % 4
        if (this.step === 0) {
            this.step = 1
        }
        this.scrollToTop()
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

    modifyRules(data, form: FormGroup) {
        const workflowTypePaymentList = []
        const accountControl = (form.controls['accountRules'] as FormArray)
        accountControl.controls.forEach((group: FormGroup) => {
            this.updateRules(
                workflowTypePaymentList,
                data,
                group,
            )
        })
        return workflowTypePaymentList
    }

    updateRules(workflowTypePaymentList, data, group) {
        if (data.paymentId == group.controls['paymentId'].value) {
            data.details.splice(0, data.details.length)
            for (let j = group.controls['rules'].controls.length - 1; j >= 0; j--) {
                if (
                    group.controls['rules'].controls.length != 1 ||
                    (group.controls['rules'].controls[j].controls['amountMax'].value !=
                        '' &&
                        group.controls['rules'].controls[j].controls['amountMax'].value !=
                        null)
                ) {
                    // just add if the only line is valid or has many lines
                    const dataArray = {
                        amountMax:
                            group.controls['rules'].controls[j].controls['amountMax'].value,
                        amountMin:
                            group.controls['rules'].controls[j].controls['amountMin'].value,
                        containsLevels:
                            group.controls['rules'].controls[j].controls['containsLevels']
                                .value,
                        levels: [
                            group.controls['rules'].controls[j].controls['l1'].value,
                            group.controls['rules'].controls[j].controls['l2'].value,
                            group.controls['rules'].controls[j].controls['l3'].value,
                            group.controls['rules'].controls[j].controls['l4'].value,
                            group.controls['rules'].controls[j].controls['l5'].value,
                        ],
                    }
                    data.details.push(dataArray)
                }
            }
            workflowTypePaymentList.push(data)
        }
        return workflowTypePaymentList
    }

    fillFormModify(data, form) {
        this.formModify = this.fb.group({
            accountNumber: [''],
            accountRules: new FormArray([]),
        })
        let index = 0
        const accountControl = (this.formModify.controls['accountRules'] as FormArray)
        form.controls.forEach((group: FormGroup) => {
            if (
                data.details.length !=
                form.controls[index].controls['rules'].controls.length
            ) {
                accountControl.push(group)
            } else {
                accountControl.push(group)
            }
            index++
        })
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
                    this.nextStep()
                    return
                }
            })
    }

    onError(error: any) {
        const res = error
        this.messageError['code'] = res.error.errorCode
        this.messageError['description'] = res.error.errorDescription
    }

    onInitStep1(events) {
        this.step1 = events
        this.form = this.step1.form
    }

    onInitStep2(events) {
        this.step2 = events
    }

    getBackUrl() {
        this.router.navigate(['/companyadmin/workflow/requestStatus']);
    }

    isDisabled() {
        if (this.form.controls['accountRules']['controls'].length == 0) {
            return true
        } else {
            return (
                !this.form.valid ||
                !this.step1.isValidMinMaxControls()
            )
        }
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
                this.nextStep();
            }
        })
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

    isPending(): boolean {
        return false;
    }
}
