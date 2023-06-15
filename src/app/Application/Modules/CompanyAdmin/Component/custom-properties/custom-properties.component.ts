import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from "@ngx-translate/core"
import _ from "lodash"
import { AuthenticationService } from "../../../../../core/security/authentication.service"
import { StorageService } from '../../../../../core/storage/storage.service'
import { RequestValidate } from "../../../../Model/requestvalidateType"
import { ResponseGenerateChallenge } from "../../../../Model/responsegeneratechallenge.type"
import { AbstractWizardComponent } from "../../../Common/Components/Abstract/abstract-wizard.component"
import { CustomPropertiesService } from '../../Services/custom-properties.service'
import { AccountBatchList } from './custom-properties-Models'
import { catchError, map } from 'rxjs/operators'
import { Exception } from 'app/Application/Model/exception'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'

@Component({
    selector: 'app-custom-properties',
    templateUrl: './custom-properties.component.html',
    styleUrls: ['./custom-properties.component.scss'],
})
export class CustomPropertiesComponent
    extends AbstractWizardComponent
    implements OnInit, OnDestroy {
    @ViewChild('authorization') authorization: any

    manageCompanyForm: FormGroup
    private company: any

    companyWorkflowTypes: any[]
    currentLang: string

    originalFormValues = {}
    formChanged = false;

    showCompanyLimitFlag = false
    currentDailyLimit: any;
    maximumAmount: any;
    generateChallengeAndOTP: ResponseGenerateChallenge = null

    constructor(
        public storageService: StorageService,
        public customPropertiesService: CustomPropertiesService,
        public authenticationService: AuthenticationService,
        public router: Router,
        public fb: FormBuilder,
        public translate: TranslateService
    ) {
        super(fb, translate, router)
        this.requestValidate = new RequestValidate()

        this.manageCompanyForm = this.fb.group({
            resetPasswordNotification: [false, Validators.required],
            registrationNumber: ['', [Validators.minLength(15), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
            companyWorkflowType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        })

        this.currentLang = this.translate.currentLang
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(result => {
                this.currentLang = this.translate.currentLang
                this.getCompanyWorkflowTypes()
            })
        )
    }

    ngOnInit(): void {
        this.company = this.storageService.retrieve('company')
        this.subscriptions.push(
            this.customPropertiesService.getCompanyParameters().subscribe((result: any) => {
                this.manageCompanyForm.controls['resetPasswordNotification'].patchValue(
                    result.resetPassPushNotification,
                )
                this.manageCompanyForm.controls['registrationNumber'].patchValue(
                    result.vatNumber,
                )
                this.manageCompanyForm.controls['companyWorkflowType'].patchValue(
                    result.companyWorkflowType,
                )

                this.originalFormValues = {
                    resetPasswordNotification: result.resetPassPushNotification,
                    registrationNumber: result.vatNumber,
                    companyWorkflowType: result.companyWorkflowType          
                }
                this.subscriptions.push(
                    this.manageCompanyForm.valueChanges.subscribe(e => {
                        this.formChanged = !_.isEqual(e, this.originalFormValues)
                    })
                );

            })
        )
        this.getCompanyWorkflowTypes()
    }

    changeCompanyLimitChange() {
        this.showCompanyLimitFlag = !this.showCompanyLimitFlag
        if (!this.maximumAmount && this.showCompanyLimitFlag) {
            this.subscriptions.push(
                this.customPropertiesService.getCompanyMaximumAmount().subscribe((result: any) => {
                    this.originalFormValues['dailyLimit'] = result.companyLimit
                    this.currentDailyLimit = result.companyLimit;
                    this.maximumAmount = result.maxCompanyLimit;

                    this.manageCompanyForm.addControl('dailyLimit',
                        new FormControl(result.companyLimit, [Validators.required, Validators.max(this.maximumAmount)])
                    );
                })
            )
        }

        if (this.showCompanyLimitFlag) {
            this.originalFormValues['dailyLimit'] = this.currentDailyLimit;
            this.manageCompanyForm.addControl('dailyLimit',
                new FormControl(this.currentDailyLimit, [Validators.required, Validators.max(this.maximumAmount)]));
        } else {
            delete this.originalFormValues['dailyLimit']
            this.manageCompanyForm.removeControl('dailyLimit');
        }
    }

    updateCompanyParameters() {
        const dataAccountBatchList: AccountBatchList = {
            resetPasswordPushNotification: this.manageCompanyForm.get('resetPasswordNotification').value,
            vatNumber: this.manageCompanyForm.get('registrationNumber').value,
            companyWorkflowType: this.manageCompanyForm.controls['companyWorkflowType'].value,
            companyLimit: this.manageCompanyForm.controls['dailyLimit']?.value
        }

        if(this.showCompanyLimitFlag){
            this.subscriptions.push(
                this.customPropertiesService
                    .updateCompanyLimit(dataAccountBatchList, this.requestValidate)
                    .subscribe((res) => {
                        if (res.errorCode == '0') {
                            this.wizardStep++
                            this.company.adminResetPassNotification = dataAccountBatchList.resetPasswordPushNotification
                            this.storageService.store('company', this.company)
                        } else {
                            const result = <any>res
                            this.messageError['code'] = result.error.errorCode
                            this.messageError['description'] = result.error.errorDescription
                        }
                    }) 
            )
        }else {
            this.subscriptions.push(
                this.customPropertiesService
                    .updateCompanyParameters(dataAccountBatchList)
                    .subscribe((res) => {
                        if (res.errorCode == '0') {
                            this.wizardStep++
                            this.company.adminResetPassNotification = dataAccountBatchList.resetPasswordPushNotification
                            this.storageService.store('company', this.company)
                        } else {
                            const result = <any>res
                            this.messageError['code'] = result.error.errorCode
                            this.messageError['description'] = result.error.errorDescription
                        }
                    } )
            )
        }
        
    }

    getCompanyWorkflowTypes() {
        this.subscriptions.push(
            this.customPropertiesService.getCompanyWorkflowTypesModel().subscribe(result => {
                this.companyWorkflowTypes = result
            })
        )
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                if (this.currentDailyLimit !== this.manageCompanyForm.controls['dailyLimit']?.value &&
                    this.manageCompanyForm.controls['dailyLimit']?.value) {
                    this.subscriptions.push(
                        this.customPropertiesService
                            .validateCompanyLimit({ 'companyLimit': this.manageCompanyForm.controls['dailyLimit'].value })
                            .subscribe((result) => {
                                if (result.hasOwnProperty('error')) {
                                    const res = <any>result
                                    this.messageError['code'] = res.error.errorCode
                                    this.messageError['description'] = res.error.errorDescription
                                    
                                } else {
                                    this.generateChallengeAndOTP = result['generateChallengeAndOTP'];
                                    if (this.isSolePropietorCompany(result['generateChallengeAndOTP'])) {
                                        this.wizardStep++
                                        this.manageCompanyForm.disable();
                                    } else { this.wizardStep = 3; }
                                }
                            })
                    )
                }
                else {
                    this.wizardStep++
                    this.manageCompanyForm.disable()
                }
                break
            case 2:
                this.updateCompanyParameters()
                break
            case 3:
                this.router.navigate(['/'])
                break
        }
    }

    back() {
        if (this.wizardStep > 1) {
            this.wizardStep--
            if (this.wizardStep === 1) {
                this.manageCompanyForm.enable()
            }
        } else {
            this.router.navigate(['/'])
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy()
    }

    getWizardStepsCount() {
        this.wizardStepsCount = 3
        return this.wizardStepsCount
    }

    isDisabled() {
        if (this.wizardStep === 1) {
            return this.formChanged ? this.manageCompanyForm.valid : this.formChanged
        } else if (this.wizardStep === 2 && !this.generateChallengeAndOTP) {
            return true
        } else if (this.wizardStep === 2 &&  this.generateChallengeAndOTP && this.requestValidate.valid()) {
            return !this.authorization || this.authorization.valid()
        } else return this.wizardStep === 3;
    }
    isSolePropietorCompany(propietorCompanyType: any): boolean {
        return propietorCompanyType['owner']
    }

    onInitStep(step, events) {
    }

    valid() {
    }

    private _handleError(error: HttpResponse<any> | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string
        if (error instanceof HttpResponse) {
          const err = error['error'] || JSON.stringify(error)
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`
        } else {
          errMsg = error.message ? error.message : error.toString()
        }
        console.error(errMsg)
        const errorService: Exception = new Exception('handle', errMsg)
        return throwError(errorService)
      }
}
