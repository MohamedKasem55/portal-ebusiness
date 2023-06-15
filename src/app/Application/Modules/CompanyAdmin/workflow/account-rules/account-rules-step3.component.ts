import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
    selector: 'app-rules-step3',
    templateUrl: './account-rules-step3.component.html',
})
export class AccountRulesStep3Component implements OnInit {
    generateChallengeAndOTP: ResponseGenerateChallenge

    constructor(public router: Router, private storageService: StorageService) {
    }

    ngOnInit() {
    }

    isPending() {
        if (
            this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
        ) {
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
