import { Component, OnInit, ViewChild } from '@angular/core'
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router'
import { AccountRulesStep1Component } from './account-rules-step1.component'
import { AccountRulesStep2Component } from './account-rules-step2.component'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component'
import { AccountRulesService } from '../../Services/workflow/account-rules/account-rules.service'
import { Exception } from 'app/Application/Model/exception'
import {CustomPropertiesService} from "../../Services/custom-properties.service";
import {forkJoin, Observable} from "rxjs";

@Component({
    selector: 'app-rules',
    templateUrl: './account-rules.component.html',
})
export class AccountRulesComponent extends AbstractAppComponent
    implements OnInit {
    @ViewChild(AccountRulesStep1Component)
    step1: AccountRulesStep1Component
    @ViewChild(AccountRulesStep2Component)
    step2: AccountRulesStep2Component

    step: number
    form: FormGroup
    formModify: FormGroup
    companyPropertiesForm: FormGroup
    accountSelected: any
    data = {}
    messageError = {}
    workflowTypePaymentList: any[] = []
    oldCompanyWorkflowType: string
    validationResponse: any = {}
    requestValidate: RequestValidate
    confirmResponse: any = {}

    constructor(
        public router: Router,
        public services: AccountRulesService,
        public customPropertiesService: CustomPropertiesService,
        public fb: FormBuilder,
        public translate: TranslateService,
    ) {
        super(translate)
        this.step = 1
        this.requestValidate = new RequestValidate()
        this.formModify = this.fb.group({
            accountNumber: [''],
            accountRules: new FormArray([]),
        })

        this.companyPropertiesForm = this.fb.group({
            companyWorkflowType: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        })

        this.setCompanyWorkflowType()
    }

    ngOnInit() {
        super.ngOnInit()
    }

    next() {
        switch (this.step) {
            case 1:
                const accountControl = (this.form.controls['accountRules'] as FormArray)
                this.data = this.step1.accountRules
                this.fillFormModify(this.data, accountControl)
                this.formModify.controls.accountNumber.patchValue(
                    this.step1.accountSelected,
                )
                this.accountSelected = this.step1.accountSelected
                this.workflowTypePaymentList = this.modifyRules(
                    this.data,
                    this.formModify,
                )
                this.validateAccountRules(this.workflowTypePaymentList)
                break
            case 2:
                this.workflowTypePaymentList = this.modifyRules(
                    this.data,
                    this.formModify,
                )
                this.confirmAccountRules(this.workflowTypePaymentList)
                break
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
            if (group.pristine == false) {
                this.updateRules(
                    workflowTypePaymentList,
                    data.workflowTypePaymentList,
                    group,
                )
            }
        })
        return workflowTypePaymentList
    }

    updateRules(workflowTypePaymentList, data, group) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].paymentId == group.controls['paymentId'].value) {
                data[i].details.splice(0, data[i].details.length)
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
                        data[i].details.push(dataArray)
                    }
                }
                workflowTypePaymentList.push(data[i])
            }
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
                !group.pristine ||
                data.workflowTypePaymentList[index].details.length !=
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
        this.services
            .validateAccountRules(workflowTypePaymentList)
            .subscribe((response: any) => {
                if (
                    response.errorCode != '0' ||
                    response.hasOwnProperty('error') ||
                    response.error instanceof Exception
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

        const observables: Observable<any>[] = []

        if(this.isCompanyWorkflowTypeChanged()){
            const companyWorkflowTypeData = {
                companyWorkflowType: this.companyPropertiesForm.controls['companyWorkflowType'].value
            }
            observables.push(this.customPropertiesService.updateCompanyParameters(companyWorkflowTypeData))
        }

        if(workflowTypePaymentList.length > 0){
            observables.push(this.services.confirmAccountRules(this.validationResponse.batchList, this.requestValidate))
        }

        if(observables.length > 0){
            forkJoin(observables).subscribe((response: any) => {
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
    }

    setCompanyWorkflowType(){
        this.customPropertiesService.getCompanyParameters().subscribe((result: any) => {

            this.companyPropertiesForm.controls['companyWorkflowType'].patchValue(
                result.companyWorkflowType,
            )

            this.oldCompanyWorkflowType = result.companyWorkflowType
        })
    }

    isCompanyWorkflowTypeChanged(): boolean{
        return this.companyPropertiesForm.controls['companyWorkflowType'].value != this.oldCompanyWorkflowType
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

    isDisabled() {

        if (this.form.controls['accountRules']['controls'].length == 0 && !this.isCompanyWorkflowTypeChanged()) {
            return true
        } else {
            if(this.isCompanyWorkflowTypeChanged()){
                return false
            } else {
                return  (
                    !this.form.valid ||
                    !this.step1.isFormAccountRulesDataDirty() ||
                    !this.step1.isValidMinMaxControls()
                )
            }
        }
    }
}
