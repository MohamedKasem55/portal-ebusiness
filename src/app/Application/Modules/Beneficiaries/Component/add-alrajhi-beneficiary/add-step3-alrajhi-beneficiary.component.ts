import {Location} from '@angular/common'
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {Router} from '@angular/router'

// Import required to work with a shared data model.
import {Subscription} from 'rxjs'
import {FormData} from '../../Model/shared-form-Data.model'
import {FormDataService} from '../../Services/shared-form-data.service'

// Import service
import {BeneficiariesGlobalService} from '../../Services/beneficiaries-global.service'

@Component({
    templateUrl:
        '../../View/add-alrajhi-beneficiary/add-step3-alrajhi-beneficiary.html',
})
export class AddStep3AlrajhiBeneficiary implements OnInit, OnDestroy {
    @ViewChild('authorization', {static: true}) authorization: any
    @Input() formData: FormData

    sharedData: any = {}
    errorAccountValidation: boolean
    subscription: Subscription

    constructor(
        public formDataService: FormDataService,
        public beneficiariesGlobalAddService: BeneficiariesGlobalService,
        public _location: Location,
        public router: Router,
    ) {
    }

    saveAlrajhiBeneficiary(): void {
        //console.log("----- SAVE -----");
        const params: any = {
            email: this.formData.email,
            nickName: this.formData.nickName,
            requestValidate: {
                challengeNumber:
                    this.sharedData.generateChallengeAndOTP &&
                    'CHALLENGE' ==
                    this.sharedData.generateChallengeAndOTP.typeAuthentication
                        ? this.sharedData.requestValidate.challengeNumber
                        : '',
                challengeResponse:
                    this.sharedData.generateChallengeAndOTP &&
                    'CHALLENGE' ==
                    this.sharedData.generateChallengeAndOTP.typeAuthentication
                        ? this.sharedData.requestValidate.challengeResponse
                        : '',
                otp:
                    this.sharedData.generateChallengeAndOTP &&
                    'OTP' == this.sharedData.generateChallengeAndOTP.typeAuthentication
                        ? this.sharedData.requestValidate.otp
                        : '',
                password:
                    this.sharedData.generateChallengeAndOTP &&
                    'STATIC' == this.sharedData.generateChallengeAndOTP.typeAuthentication
                        ? this.sharedData.requestValidate.password
                        : '',
            },
        }

        // Call service to add Al Rajhi Beneficiary
        this.subscription = this.beneficiariesGlobalAddService
            .addAlRajhiBeneficiary(params, this.formData.account)
            .subscribe((responseMsg) => {
                //console.log(responseMsg);
                if (responseMsg['errorCode'] == '0') {
                    this.formData.errorAccountValidation = false
                    this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
                } else {
                    this.router.navigateByUrl(
                        '/beneficiaries/AlrajhiBeneficiary/AddStep3',
                    )
                }

                this.subscription.unsubscribe()
            })
    }

    goBack() {
        this.router.navigateByUrl('/beneficiaries/AlrajhiBeneficiary/AddStep2')
    }

    ngOnInit() {
        this.formData = this.formDataService.getData()
        this.sharedData = this.formDataService.getSharedData()
    }

    ngOnDestroy() {
        this.formDataService.setData(this.formData)
        this.formDataService.setSharedData(this.sharedData)
    }

    valid() {
        return (
            !this.sharedData.generateChallengeAndOTP ||
            !this.authorization ||
            this.authorization.valid()
        )
    }

    finish() {
        this.formData.errorAccountValidation = false
        this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
    }
}
