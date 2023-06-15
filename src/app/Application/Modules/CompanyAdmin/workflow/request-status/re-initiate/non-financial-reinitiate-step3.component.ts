import { RouterModule } from '@angular/router';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type';
import { StorageService } from 'app/core/storage/storage.service'

@Component({
    selector: 'non-financial-reinitiate-step3',
    templateUrl: './non-financial-reinitiate-step3.component.html',
})
export class NonFinancialReinitiateStep3Component implements OnInit {
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge
    @Input() action: any;
    constructor(public router: RouterModule, private storageService:StorageService) {

    }
    ngOnInit() {
    }

    isPending() {

        if ((this.action ==='delete') || (this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
        )) {
            return false
        } else {
            if (this.storageService.retrieve('currentuser') !== undefined) {
                return JSON.parse(this.storageService.retrieve('currentuser'))[
                    'company'
                ]['dualAuthorization']
            }
            return true
        }
    }
}
