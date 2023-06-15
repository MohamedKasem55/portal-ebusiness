import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {GoldWalletService} from "../service/gold-wallet.service";
import {GoldWalletDashboardRes} from "../model/gold-wallet-dashboard-res";
import {SellRequestDTO} from "../model/sell-request-dto";
import {BullionItem, SellGoldValidateReq} from "../model/sell-gold-validate-req";
import {SellGoldValidateRes} from "../model/sell-gold-validate-res";
import {RequestValidate} from "../../../Model/requestvalidateType";
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";
import {SellGoldConfirmReq} from "../model/sell-gold-confirm-req";

@Component({
    selector: 'arb-gold-sell',
    templateUrl: './gold-sell.component.html',
    styleUrls: ['./gold-sell.component.scss']
})
export class GoldSellComponent implements OnInit {

    steps = ['gold-wallet.select-gold',
        'gold-wallet.select-fraction',
        'gold-wallet.sell-gold',
        'gold-wallet.finish'];

    step = 1;
    language: string;
    subscriptions: Subscription[] = [];
    isDisabledButton: boolean;
    transactionList: any[] = [];
    transactionListAfterEdit: any[] = [];
    dashboardObject: GoldWalletDashboardRes;
    sellRequestDTO: SellRequestDTO = new SellRequestDTO();
    sellGoldValidateRes: SellGoldValidateRes = new SellGoldValidateRes();
    generateChallengeAndOTP: ResponseGenerateChallenge = new ResponseGenerateChallenge();
    requestValidate: RequestValidate = new RequestValidate();
    isSuccessOnBoarding: boolean = false;
    isValidOTP: any = false;

    constructor(private translate: TranslateService, private goldWalletService: GoldWalletService, private router: Router) {
        this.dashboardObject = this.goldWalletService.getDashBoardObject();
        if (!this.dashboardObject) {
            this.router.navigate(['gold-wallet/dashboard']);
        }
        this.sellRequestDTO.dashboardObject = this.dashboardObject;
        this.fetchLanguage();
    }

    fetchLanguage() {
        this.language = this.translate.currentLang;
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(
                (lang) => {
                    this.language = lang.lang;
                    this.sellRequestDTO.language = lang.lang;
                }
            ));
    }

    ngOnInit(): void {
    }

    onTransactionSelection(transactionList) {
        this.transactionList = transactionList;
    }

    nextStep() {
        switch (this.step) {
            case 1 :
                this.transactionListAfterEdit = [];
                this.step++
                break;
            case 2 :
                this.validateSell()
                break;
            case 3:
                this.confirmSell();
                break;
            default :
                this.step++
                break
        }
    }

    getTransactionList() {
        return this.transactionList;
    }

    onChangeTransactions(transactionListAfterEdit) {
        this.transactionListAfterEdit = transactionListAfterEdit;
    }

    cancel() {
        void this.router.navigate(['gold-wallet/dashboard']);
    }

    backStep() {
        if (this.step == 2) {
            this.transactionListAfterEdit = [];
            this.transactionList = [];
        }
        this.step--
    }

    validateSell() {
        let req: SellGoldValidateReq = new SellGoldValidateReq();
        req.walletId = this.dashboardObject.walletNum;
        req.accountNumber = this.dashboardObject.linkedAccountNumber;
        this.transactionListAfterEdit = (this.transactionListAfterEdit.length < 0) ? this.transactionListAfterEdit : this.transactionList;
        for (let trx of this.transactionListAfterEdit) {
            let bullionItem = new BullionItem();
            bullionItem.goldCode = trx.goldCode;
            bullionItem.weight = trx.selectedValue;
            bullionItem.customWeight = trx.customWeight;
            req.bullionLst.push(bullionItem);
        }
        this.goldWalletService.validateSellGold(req).subscribe((res: any) => {
            this.sellGoldValidateRes = res;
            this.generateChallengeAndOTP = res.generateChallengeAndOTP;
            this.sellRequestDTO.sellGoldValidateRes = res;
            this.step++;
        })
    }

    otpChange(isValidOTP) {
        this.isValidOTP = isValidOTP;
    }

    navigateToGoldWallet() {
        this.cancel();
    }

    confirmSell() {
        let req: SellGoldConfirmReq = new SellGoldConfirmReq();
        req.transactionKey = this.sellRequestDTO.sellGoldValidateRes.transactionKey;
        req.referenceNumber = this.sellRequestDTO.sellGoldValidateRes.referenceNumber
        req.requestValidate = this.requestValidate
        this.goldWalletService.confirmSellGold(req).subscribe((res: any) => {
            this.isSuccessOnBoarding = res.errorCode === '0'
            this.step++;
        })
    }

    checkStepValidation() {
        if (this.step === 3) {
            return !this.isValidOTP
        } else {
            return this.transactionList.length < 1 && this.transactionListAfterEdit.length < 1;
        }
    }
}
