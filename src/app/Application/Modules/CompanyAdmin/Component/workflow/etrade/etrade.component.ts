import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Exception } from '../../../../../Model/exception'
import { EtradeStep1Component } from './etrade-step1.component'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { EtradeStep2Component } from "./etrade-step2.component";
import { EtradeService } from "../../../Services/workflow/etrade/etrade.service";

@Component({
    selector: 'app-etrade',
    templateUrl: './etrade.component.html',
})
export class EtradeComponent
    extends AbstractAppComponent
    implements OnInit {
    @ViewChild(EtradeStep1Component)
    step1: EtradeStep1Component
    @ViewChild(EtradeStep2Component)
    step2: EtradeStep2Component

    step: number
    data = {}
    messageError = {}

    validationResponse: any = {}
    requestValidate: RequestValidate
    confirmResponse: any = {}
    companyDetails: any = {}
    modifyArray: any = []
    constructor(
        public router: Router,
        public services: EtradeService,
        public fb: FormBuilder,
        public translate: TranslateService,
    ) {
        super(translate)
        this.step = 1
        this.requestValidate = new RequestValidate()
    }

    ngOnInit() {
        super.ngOnInit()
        this.getCompanyDetails()
    }

    getCompanyDetails() {
        this.services.getCompanyDetails().subscribe((result: any) => {
            const body = result
            if (
                body.hasOwnProperty('error') &&
                (<any>body).error instanceof Exception
            ) {
                this.onError(body)
                return
            } else {
                this.companyDetails = body.companyDetails
                this.companyDetails["companyEtradeFunctionList"].forEach((functionItem) => {
                    functionItem.companyEtradeWorkflows.forEach((item) => {
                        item.error = 0
                        item.amount = item.amount.toFixed(2);
                        item.oldAmount = item.amount
                    })
                    functionItem.companyEtradeWorkflows.sort((a, b) => {
                        if (a.level > b.level) {
                            return 1
                        }
                        if (a.level < b.level) {
                            return -1
                        }
                        return 0
                    })
                })
            }
        })
    }

    next() {
        switch (this.step) {
            case 1:
               this.modifyArray = this.step1.modifyArray;
                this.validateCompanyDetails(this.modifyArray)
                break
            case 2:
                this.confirmCompanyDetails()
                break
            case 3:
                this.finish()
                break
        }
    }

    validateCompanyDetails(companyEtradeFunctionList: any) {
        this.services
            .validateCompanyDetails(companyEtradeFunctionList)
            .subscribe((response: any) => {
                if (
                    response.hasOwnProperty('error') &&
                    (<any>response).error instanceof Exception
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

    confirmCompanyDetails() {
        this.services
            .confirmCompanyDetails(
                this.validationResponse.batchList,
                this.requestValidate,
            )
            .subscribe((response: any) => {
                console.log("🚀 ~ file: etrade.component.ts ~ line 120 ~ .subscribe ~ response", response)
                if (
                    response.errorCode != '0' ||
                    response.hasOwnProperty('error') ||
                    response.error instanceof Exception
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

    onError(error: any) {
        const res = error
        this.messageError['code'] = res.errorCode
        this.messageError['description'] = res.errorDescription
        console.log("🚀 ~ file: etrade.component.ts ~ line 161 ~ onError ~ this.messageError", this.messageError)
    }

    onInitStep1(events) {
        this.step1 = events
    }

    onInitStep2(events) {
        this.step2 = events
    }

    isDisabled() {
        switch (this.step) {
            case 1:
                let valid = true;
                if (this.companyDetails && this.companyDetails['companyEtradeFunctionList']) {
                    this.companyDetails['companyEtradeFunctionList'].forEach((functionItem) => {
                        functionItem.companyEtradeWorkflows.forEach((item) => {
                            if (item.error === 1) {
                                valid = false;
                            }
                        })
                    })
                }
                return (this.step1.notModify ? this.step1.notModify : !valid);
                break;
            case 2:
                return false;
                break;
        }
        return false;
    }

}
