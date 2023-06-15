import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {GoldWalletOnBoardingRequestDTO} from "../model/gold-wallet-on-boarding-request-d-t-o";
import {Router} from "@angular/router";
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../Model/requestvalidateType";
import {GoldWalletService} from "../service/gold-wallet.service";
import {WalletOnBoardingConfirmReq} from "../model/wallet-on-boarding-confirm-req";
import {WalletOnBoardingValidationRequest} from "../model/wallet-on-boarding-validation-request";
import {WalletOnBoardingConfirmRes} from "../model/wallet-on-boarding-confirm-res";

@Component({
    selector: 'arb-gold-wallet-on-boarding',
    templateUrl: './gold-wallet-on-boarding.component.html',
    styleUrls: ['./gold-wallet-on-boarding.component.scss']
})
export class GoldWalletOnBoardingComponent implements OnInit, OnChanges, OnDestroy {
    steps =
        ['gold-wallet.T&C', 'gold-wallet.select-acc-step',
            'gold-wallet.summary', 'gold-wallet.finish'];
    /*
    * LANDING
    * STEPPER
    * */
    pageName = "LANDING";
    step = 0;
    subscriptions: Subscription[] = [];
    language: string;
    goldWalletOnBoardingRequest: GoldWalletOnBoardingRequestDTO = new GoldWalletOnBoardingRequestDTO();
    isDisabledButton: boolean;
    isSuccessOnBoarding: boolean = false;

    @Input() generateChallengeAndOTP: ResponseGenerateChallenge;
    requestValidate: RequestValidate = new RequestValidate();
    walletOnBoardingConfirmRes: WalletOnBoardingConfirmRes = new WalletOnBoardingConfirmRes();

    constructor(private translate: TranslateService, private router: Router, public goldWalletService: GoldWalletService) {
        this.fetchLanguage();
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
    }

    cancel() {
        this.router.navigate(['/'])
    }

    nextStep() {
        switch (this.step) {
            case 2 :
                this.generateOTP();
                this.step++;
                break;
            case 3:
                this.confirmRequest();
                break;
            default :
                this.step++;
                break
        }
        this.validateChanges(this.goldWalletOnBoardingRequest)
    }

    fetchLanguage() {
        this.language = this.translate.currentLang;
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(
                (lang) => {
                    this.language = lang.lang
                }
            ));
    }

    startOnBoarding() {
        this.step = 1
        this.pageName = 'STEPPER';
    }

    validateChanges(event: any) {
        if ((this.step === 1 && event.termsAndConditionAccepted) ||
            (this.step === 2 && event.termsAndConditionAccepted && event.account && event.account.fullAccountNumber) ||
            (this.step === 3 && event.termsAndConditionAccepted && event.account && event.account.fullAccountNumber &&
                this.generateChallengeAndOTP)) {
            this.isDisabledButton = false
        } else {
            this.isDisabledButton = true
        }
    }


    confirmRequest() {
        const req = new WalletOnBoardingConfirmReq();
        req.linkedAccountDTO = this.goldWalletOnBoardingRequest.account;
        req.requestValidate = this.requestValidate;
        this.goldWalletService.confirmWalletOnBoarding(req).subscribe((res) => {
            if ('0' !== res.errorCode) {
                this.isSuccessOnBoarding = false;
                this.step++;
            } else {
                this.isSuccessOnBoarding = true;
                this.walletOnBoardingConfirmRes.walletId = res.walletId;
                this.walletOnBoardingConfirmRes.linkedAccountDTO = res.linkedAccountDTO;
                this.step++;
            }
        });
    }

    back() {
        this.step--;
    }

    generateOTP() {
        let req = new WalletOnBoardingValidationRequest();
        req.linkAccount = this.goldWalletOnBoardingRequest.account
        this.goldWalletService.validateWalletOnBoarding(req).subscribe(
            (res: any) => {
                this.generateChallengeAndOTP = res.generateChallengeAndOTP;
            }
        )
    }

    otpChange(valid) {
        this.isDisabledButton = !valid
    }

    navigateToGoldWallet() {
        void this.router.navigate(['/gold-wallet/dashboard'])
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }
}
