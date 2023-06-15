import {AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AbstractWizardComponent } from '../../Common/Components/Abstract/abstract-wizard.component';
import { WpsPayrollService } from './wps-payroll-new.service';
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type';
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { date } from 'ngx-custom-validators/src/app/date/validator'
import {StorageService} from "../../../../core/storage/storage.service";
import {Exception} from "../../../Model/exception";
import {throwError as observableThrowError} from "rxjs/internal/observable/throwError";
import {ModalDirective} from "ngx-bootstrap/modal";
import {WpsRequestStatus} from "../WpsRequestStatus/wps-request-status.service";



@Component({
    selector: 'wps-payroll-new',
    templateUrl: './wps-payroll-new.component.html',
    styleUrls: ['./wps-payroll-new.component.scss'],
})

export class WpsPayrollNewComponent extends AbstractWizardComponent
    implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('wpsModal') wpsModal: ModalDirective

    public formModel: FormGroup;
    public combosData: any = [];
    public showDetails: boolean = false;
    public generateChallengeAndOTP: ResponseGenerateChallenge;
    public requestValidate: RequestValidate = new RequestValidate();
    public isUpdate: boolean = false;
    public updatedItem: any = {};
    public hasBeenValidated: boolean;
    public startSubscribeProcess: boolean;
    public backBtnValue: string = 'public.back';
    public isEligibleToRegister: boolean;
    public doesNationalAddressExist: boolean;
    public companyAlreadyRegistered: boolean
    public mobileNumber: any;

    constructor(
        public injector: Injector,
        public fb: FormBuilder,
        public router: Router,
        private activateRoute: ActivatedRoute,
        public translate: TranslateService,
        private wpsPayrollService: WpsPayrollService,
        private wpsRequestStatus: WpsRequestStatus,
        public translateService: TranslateService
    ) {
        super(fb, translate, router)

        const routeData = this.router.getCurrentNavigation().extras.state?.data
        if(!routeData && this.router.url.indexOf('update') > 0){
            this.router.navigateByUrl('./')
        }
        this.updatedItem = routeData
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit() {
        this.formModel = this.wpsPayrollService.createForm()
        if (this.router.url == "/newProduct/wps/new") {
            this.startAgreement()
        } else {
            this.formModel = this.wpsPayrollService.createFormWithData(this.updatedItem);
            this.update()
        }
    }

    ngOnInit(): void {

        const storageService = this.injector.get(StorageService)
        const user = storageService.retrieve('user')
        this.mobileNumber = user.mobile;

    }

    onInitStep(step: any, events: any) {

    }
    isDisabled() {

    }
    valid() {

    }
    back() {

    }
    next() {

    }
    getWizardStepsCount() {

    }

    startAgreement(){
        if (this.isNationalAddressAvailable()) {
            this.wpsPayrollService.getPayrollAgreementEligibility().subscribe((res) => {
                if(res.errorCode == '0'){
                    if (res.eligibleToRegister) {
                        this.getAccounts()
                    } else if (!res.eligibleToRegister && !res.eligibleToUpdate) {
                        this.isEligibleToRegister = false
                        this.wpsModal.show()
                    } else if (!res.eligibleToRegister && res.eligibleToUpdate) {
                        this.showActiveAgreement()
                    }
                } else {
                    this.router.navigate(['/'])
                }
            })
        } else {
                this.doesNationalAddressExist = false;
                this.wpsModal.show()
        }
    }

    showActiveAgreement(){
        this.wpsRequestStatus.getRequestStatus().subscribe((res) => {
            const activeAgreement = res.companyPayrollAgreementDTOS.filter(agreement => agreement.status == 'ACTIVE' || agreement.status == this.translateService.instant('newProduct.requestStatus.active'))

            if(activeAgreement){
                this.router.navigateByUrl('/newProduct/wps/requestDetails',  {state: {data: activeAgreement[0]}});
            }
        });
    }

    isNationalAddressAvailable() :boolean {
        const storageService = this.injector.get(StorageService)
        const welcome = storageService.retrieve('welcome')
        return welcome.nationalAdress === "Y";
    }

    getAccounts(){
        this.wpsPayrollService.getAccounts().subscribe((res) => {
            if(this.isUpdate){
                let accounts = res.filter(account => account.ibanNumber == this.updatedItem.account)
                this.formModel.controls['chargeAccount'].patchValue(accounts[0])
                this.showDetails = true;
            } else {
                this.combosData['chargeAccounts'] = res;
            }

            this.startSubscribeProcess = true
        })
    }

    subscribe() {
        this.startAgreement()
    }


    goBack() {
        switch (this.wizardStep) {
            case 1:
                if(this.startSubscribeProcess && this.showDetails){
                    this.showDetails = false;
                    break;
                }
                this.startSubscribeProcess = false;
                break;
            case 2:
                this.formModel.enable()
                this.formModel.controls['termsAccept'].setValue(false);
                // this.formModel.controls['molID'].setValue(null);
                this.showDetails = true;
                this.hasBeenValidated = false;
                this.requestValidate = new RequestValidate();
                this.backBtnValue = 'public.back';
                this.wizardStep--;
                break;
            case 3:
                    if (this.isUpdate) {
                        this.router.navigate(['/newProduct/wps/requestDetails']);
                    } else {
                        this.formModel.controls['numberOfEmployees'].setValue(null);
                    }
                    this.wizardStep--;
                    if (this.wizardStep === 1) {
                        this.formModel.controls['chargeAccount'].setValue('');
                        // this.formModel.controls['molID'].setValue(null);
                        this.showDetails = true;
                    }
                break;
        }
    }

    proceed() {
        switch (this.wizardStep) {
            case 1:
                if(!this.showDetails && !this.isUpdate){
                    let numberOfEmployees = this.formModel.controls['numberOfEmployees'].value;
                    this.getPayrollAgreement(numberOfEmployees);
                    break;
                }
                this.formModel.controls['termsAccept'].patchValue(false)
                super.markNextWizardStep()
                break;
            case 2:
                if(this.isUpdate){
                    this.confirm();
                }else{
                    if(!this.hasBeenValidated){
                        this.validate()
                        this.backBtnValue = 'public.cancel'
                    }
                    if(this.requestValidate.valid() ){
                        this.confirm();
                    }
                }
                break;
            case 3:
                this.router.navigate(['/newProduct/wps/requestStatus']);
                break;
        }
    }

    private confirm() {
        let data = {
            account: this.formModel.controls['chargeAccount'].value.ibanNumber,
            agreementTemplateId: this.formModel.controls['templateId'].value,
            employeeCount: this.formModel.controls['numberOfEmployees'].value,
            mol_ID: this.formModel.controls['molID'].value,
            requestValidate: this.isUpdate? null : this.requestValidate
        };
        this.wpsPayrollService.confirmAgreement(data).subscribe((res) => {
            if (res.errorCode == '0') {
                super.markNextWizardStep()
            }
        });
    }

    private validate() {
        let data = {
            account: this.formModel.controls['chargeAccount'].value.ibanNumber,
            agreementTemplateId: this.formModel.controls['templateId'].value,
            employeeCount: this.formModel.controls['numberOfEmployees'].value,
            mol_ID: this.formModel.controls['molID'].value,
        };
        this.wpsPayrollService.validateAgreement(data).subscribe((res) => {
            if (res.errorCode == '0') {
                this.generateChallengeAndOTP = res.generateChallengeAndOTP;
                this.hasBeenValidated = true;
                this.formModel.disable()
            }
        });
    }

    private update() {
        this.isUpdate = true
        this.hasBeenValidated = false
        this.getAccounts()
    }

    private getPayrollAgreement(numberOfEmployees){
        this.wpsPayrollService.getPayrollAgreement(numberOfEmployees).subscribe((res: any) => {
            if(res.errorCode =='0'){
                this.formModel.controls['monthlyFees'].setValue(res.agreementTemplateDTO.monthlyFees);
                this.formModel.controls['employeeFees'].setValue(res.agreementTemplateDTO.employeeFees);
                this.formModel.controls['templateId'].setValue(res.agreementTemplateDTO.templateId);
                this.showDetails = true;
            }

        });
    }

    canProceed() :boolean {
        switch (this.wizardStep) {
            case 1:
                if(!this.showDetails){
                    return !this.formModel.controls['numberOfEmployees'].valid;
                }
                this.formModel.controls['termsAccept'].patchValue(true)
                return !this.formModel.valid;
            case 2:
                if (!this.hasBeenValidated){
                    return !(this.formModel.controls['termsAccept'].value && this.formModel.valid);
                } else if (!this.requestValidate.valid()) {
                    return true
                }
        }
    }
    close() {
        this.wpsModal.hide()
        if(this.companyAlreadyRegistered){
            this.showActiveAgreement()
        } else {
            this.router.navigate(['/'])
        }
    }
}
