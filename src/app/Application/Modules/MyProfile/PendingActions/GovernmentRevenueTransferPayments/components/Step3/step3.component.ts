import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
    step = 3
    sharedData: any = {}
    error: any = {}
    paymentResult: any = {}

    constructor(private router: Router) {
        this.error.exist = false
    }

    ngOnInit(): void {
        this.paymentResult = this.sharedData.authorizeValidate
    }

    finish() {
        this.sharedData.isDetailActivated = false;
        this.sharedData.approveFlow = false;
        this.sharedData.authorizeValidate = null;
        this.sharedData.generateChallengeAndOTP = null;
        this.sharedData.rejectedReason = null;
        this.sharedData.validation = null;
        this.sharedData.isDetailActivated = false;
        this.sharedData.isDetailActivated = false;

        this.sharedData.govRevTransPayTableSelected = [];
        this.sharedData.govRevFileTransPayTableSelected = [];

        this.router.navigate([
            '/myprofile/pending/government-revenue-transfer-payments/step1',
        ])
    }

    isSinglePayment(){
        return (this.paymentResult.batchList.toProcess.length > 0 || this.paymentResult.batchList.toAuthorize.length > 0 ||
            this.paymentResult.batchList.notAllowed.length > 0 ? true : false) && this.sharedData?.validation?.processedBatch
    }

    getGovPayment() {
        let payment = {}
        if (
            this.paymentResult.batchList &&
            this.paymentResult.batchList.toProcess.length > 0
        ) {
            payment = this.paymentResult.batchList.toProcess[0]
        } else if (
            this.paymentResult.batchList &&
            this.paymentResult.batchList.toAuthorize.length > 0
        ) {
            payment = this.paymentResult.batchList.toAuthorize[0]
        } else if (
            this.paymentResult.batchList &&
            this.paymentResult.batchList.notAllowed.length > 0
        ) {
            payment = this.paymentResult.batchList.notAllowed[0]
        }
        return payment
    }
    
    valid() {
        return true
    }
}
