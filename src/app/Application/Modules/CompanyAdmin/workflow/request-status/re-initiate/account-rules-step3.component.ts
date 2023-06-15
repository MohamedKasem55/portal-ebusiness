import {Component, Input, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
    selector: 'app-rules-reinitiate-step3',
    templateUrl: './account-rules-step3.component.html',
})
export class AccountRulesReinitiateStep3Component implements OnInit {
    generateChallengeAndOTP: ResponseGenerateChallenge
    @Input() action: any;
    constructor(public router: Router, private storageService: StorageService) {
    }

    ngOnInit() {
    }

    isPending() {
        if ((this.action ==='delete') ||
            (this.generateChallengeAndOTP &&
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
