import {Location} from '@angular/common';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// Import required to work with a shared data model.
import {FormData} from '../../Model/shared-form-Data.model';
// Import service
import {ValidateAccount} from '../../Services/beneficiaries-validate-account.service'
import {FormDataService} from '../../Services/shared-form-data.service'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
    templateUrl:
        '../../View/add-alrajhi-beneficiary/add-step2-alrajhi-beneficiary.html',
})
export class AddStep2AlrajhiBeneficiary implements OnInit, OnDestroy {

    @Input() formData: FormData
    model: any
    contador = 0
    okAccountLengthAlRajhi = true
    //errorAccountValidation:boolean;
    sharedData: any = {}
    generateChallengeAndOTP: ResponseGenerateChallenge

    constructor(
        public formDataService: FormDataService,
        public validAccount: ValidateAccount,
        public _location: Location,
        private route: ActivatedRoute,
        public router: Router,
    ) {
    }

    validateAlrajhiBeneficiary(form: FormData): void {
        this.validAccount
            .getVelidationAccount(this.formData.account)
            .subscribe((result) => {
                if (result.errorCode === '0') {
                    this.generateChallengeAndOTP = result.generateChallengeAndOTP
                    this.formData.firstName = result['beneficiary']['beneficiaryName']
                    this.formData.secondName = result['beneficiary']['beneficiaryFamName']
                    this.sharedData['beneficiary'] = result['beneficiary']
                    this.sharedData['generateChallengeAndOTP'] =
                        this.generateChallengeAndOTP
                    this.sharedData['requestValidate'] = {}
                    this.formDataService.setSharedData(this.sharedData)
                    this.router.navigate(['/beneficiaries/AlrajhiBeneficiary/AddStep3'])
                }
            })
    }

    validateAddAlrajhiBeneficiary(form: FormData): void {
        const params: any = {
            email: this.formData.email,
            nickName: this.formData.nickName
        }
        this.validAccount
            .getVelidatioAddAccount(this.formData.account, params)
            .subscribe((result) => {
                if (result.errorCode === '0') {

                    this.generateChallengeAndOTP = result.generateChallengeAndOTP;

                    this.formData.firstName = result['beneficiary']['beneficiaryName'];
                    this.formData.secondName = result['beneficiary']['beneficiaryFamName'];
                    this.formData.nickName = result['beneficiary']['nickName'];

                    this.sharedData['beneficiary'] = result['beneficiary'];
                    this.sharedData['beneficiary']['nickName'] = result['beneficiary']['nickName'];
                    this.sharedData['generateChallengeAndOTP'] = this.generateChallengeAndOTP;
                    this.sharedData['requestValidate'] = {};

                    this.formDataService.setSharedData(this.sharedData);

                    this.router.navigate(['/beneficiaries/AlrajhiBeneficiary/AddStep3']);
                }
            })
    }

    goBack() {
        this.router.navigate(['/beneficiaries/AddBeneficiaries'])
    }

    ngOnInit() {
        this.formData = this.formDataService.getData()
        this.route.params.subscribe((params) => {
            if (params['back']) {
                this.sharedData['back'] = params['back']
                this.sharedData['backType'] = 'ALRAJHI'
            }
        })
    }

    ngOnDestroy() {
        this.formDataService.setData(this.formData)
    }
}
