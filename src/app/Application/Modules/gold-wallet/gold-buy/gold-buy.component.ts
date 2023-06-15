import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {GoldWalletBuyRequestDTO} from "../model/gold-wallet-buy-request-dto";
import {GoldWalletDashboardRes} from "../model/gold-wallet-dashboard-res";
import {GoldWalletService} from "../service/gold-wallet.service";
import {BuyGoldValidateReq} from "../model/buy-gold-validate-req";
import {BuyGoldValidateRes} from "../model/buy-gold-validate-res";
import {BullionWeight} from "../model/gold-wallet-bullion-res";
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../Model/requestvalidateType";
import {BuyGoldConfirmReq} from "../model/buy-gold-confirm-req";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'arb-gold-buy',
    templateUrl: './gold-buy.component.html',
    styleUrls: ['./gold-buy.component.scss']
})
export class GoldBuyComponent implements OnInit, OnDestroy {
    steps = ['gold-wallet.T&C', 'gold-wallet.select-amount', 'gold-wallet.buy-gold', 'gold-wallet.finish'];
    step = 1;
    language: string;
    subscriptions: Subscription[] = [];
    isDisabledButton: boolean = true;

    buyRequestDTO: GoldWalletBuyRequestDTO = new GoldWalletBuyRequestDTO();
    walletDashboard: GoldWalletDashboardRes;
    generateChallengeAndOTP: ResponseGenerateChallenge;
    requestValidate: RequestValidate = new RequestValidate();
    buyGoldValidateRes: BuyGoldValidateRes = new BuyGoldValidateRes();
    isSuccessOnBoarding = false;


    constructor(private translate: TranslateService, private router: Router, private goldWalletService: GoldWalletService, private smq: SimpleMQ) {
        this.walletDashboard = this.goldWalletService.getDashBoardObject();
        if (!this.walletDashboard) {
            void this.router.navigate(['/gold-wallet/dashboard'])
        }
        this.fetchLanguage();

    }

    ngOnInit(): void {
        this.smq.publish('loader-mq', false);
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

    nextStep() {
        switch (this.step) {
            case 2:
                this.validateAndBookDeal();
                break;
            case 3 :
                this.confirmBuyGold();
                break;
            default :
                this.step++;
                break;
        }
        this.validateChanges(this.buyRequestDTO)
    }

    validateAndBookDeal() {
        let req = new BuyGoldValidateReq();
        req.qty = 1;
        req.weight = this.buyRequestDTO.requestedBullion.selectedBullion;
        req.walletId = this.walletDashboard.walletNum;
        req.customWeight = this.buyRequestDTO.requestedBullion.custom;
        req.unit = BullionWeight.GM;
        req.accountNumber = this.walletDashboard?.linkedAccountNumber;
        this.goldWalletService.validateBuyGold(req).subscribe(
            (res: any) => {
                this.buyGoldValidateRes.goldVendor = res.goldVendor;
                this.buyGoldValidateRes.goldSource = res.goldSource;
                this.buyGoldValidateRes.measureUnit = res.measureUnit;
                this.buyGoldValidateRes.purity = res.purity;
                this.buyGoldValidateRes.qty = res.qty;
                this.buyGoldValidateRes.rate = res.rate;
                this.buyGoldValidateRes.referenceNumber = res.referenceNumber;
                this.buyGoldValidateRes.transactionKey = res.transactionKey;
                this.buyGoldValidateRes.timeToLive = res.timeToLive;
                this.buyGoldValidateRes.totalCost = res.totalCost;
                this.buyGoldValidateRes.weight = res.weight;
                this.generateChallengeAndOTP = res.generateChallengeAndOTP;
                this.buyRequestDTO.buyGoldValidateRes = this.buyGoldValidateRes;
                this.buyRequestDTO.generateChallengeAndOTP = this.generateChallengeAndOTP;
                this.step++;
            }
        )
    }

    confirmBuyGold() {
        let req = new BuyGoldConfirmReq();
        req.referenceNumber = this.buyGoldValidateRes.referenceNumber;
        req.transactionKey = this.buyGoldValidateRes.transactionKey;
        req.requestValidate = this.requestValidate;
        this.goldWalletService.confirmBuyGold(req).subscribe(
            (res) => {
                ('0' !== res.errorCode) ? this.isSuccessOnBoarding = false : this.isSuccessOnBoarding = true;
                this.step++;
            }
        );
    }

    backStep() {
        this.buyGoldValidateRes = new BuyGoldValidateRes();
        this.step--
    }

    cancel() {
        void this.router.navigate(['gold-wallet/dashboard']);
    }

    navigateToGoldWallet() {
        this.cancel();
    }

    validateChanges(buyRequestDTO: GoldWalletBuyRequestDTO) {
        this.isDisabledButton = !((this.step === 1 && buyRequestDTO.termsAndConditionAccepted)
            || (this.step === 2 && buyRequestDTO.termsAndConditionAccepted && buyRequestDTO.requestedBullion.selectedBullion)
        );
    }

    otpChange(valid) {
        this.isDisabledButton = !valid
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }
}
