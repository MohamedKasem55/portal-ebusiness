import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {ApplyMadaCard} from "./apply-mada-card";
import {DebitCardApplyService} from "./debit-card-apply.service";
import {ConfirmMadaCardRequest} from "./confirm-mada-card-request";

@Component({
    selector: 'arb-debit-card-apply',
    templateUrl: './debit-card-apply.component.html',
    styleUrls: ['./debit-card-apply.component.scss']
})
export class DebitCardApplyComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = []
    steps = ['mada-cards.card-details', 'mada-cards.select-pick-up-office', 'mada-cards.summary', 'mada-cards.finish'];
    step = 1;
    pageName = "STEPPER";
    language: string
    applyMadaCardRequest: ApplyMadaCard = new ApplyMadaCard();
    disabled = true;
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge;
    requestValidate: RequestValidate = new RequestValidate();
    private isSuccess: boolean;

    constructor(private router: Router, private translate: TranslateService, private debitCardApplyService: DebitCardApplyService) {
        this.fetchLanguage();
    }

    ngOnInit(): void {
    }

    stepBack() {
        if (this.pageName === 'OTP') {
            this.pageName = 'STEPPER'
        } else {
            if (this.step === 1) {
                this.router.navigate(['/debit-cards/list'])
            }
            this.step--;
        }

    }

    cancel(){
        this.router.navigate(['/'])
    }

    nextStep() {
        if (this.pageName === 'OTP') {
            this.confirmRequest();
        } else {
            switch (this.step) {
            case 3 :
                this.generateOTP();
                break;
            default :
                this.step++;
                break
            }
        }
    }

    private generateOTP() {
        this.debitCardApplyService.sendOwnerOTP().subscribe(
            (res) => {
                if (res) {
                    this.generateChallengeAndOTP = res.generateChallengeAndOTP;
                    this.pageName = 'OTP';
                }
            }
        )
    }

    goToDashboard() {
        this.router.navigate(['/']);
    }

    changeRequest(applyMadaCardRequest: ApplyMadaCard) {
        this.applyMadaCardRequest = applyMadaCardRequest;
        switch (this.applyMadaCardRequest.step) {
        case 1:
            if (applyMadaCardRequest &&
                    applyMadaCardRequest.account &&
                    applyMadaCardRequest.account.fullAccountNumber &&
                    applyMadaCardRequest.embossingName &&
                    applyMadaCardRequest.acceptedTermsAndConditions) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
            break
        case 2:
            this.disabled = true
            if (applyMadaCardRequest &&
                    applyMadaCardRequest.account &&
                    applyMadaCardRequest.embossingName &&
                    applyMadaCardRequest.acceptedTermsAndConditions &&
                    applyMadaCardRequest.branch) {
                this.disabled = false
            } else {
                this.disabled = true;
            }
            break
        case 3:
            break
        }
    }

    private confirmRequest() {
        const confirmMadaCardRequest = new ConfirmMadaCardRequest();
        confirmMadaCardRequest.accountNumber = this.applyMadaCardRequest.account.fullAccountNumber;
        confirmMadaCardRequest.branchId = this.applyMadaCardRequest.branch.code;
        confirmMadaCardRequest.requestValidate = this.requestValidate
        confirmMadaCardRequest.gender = this.applyMadaCardRequest.gender;
        confirmMadaCardRequest.embossingName = this.applyMadaCardRequest.embossingName;
        this.debitCardApplyService.applyMadaDebitCard(confirmMadaCardRequest).subscribe((res) => {
            if (res.errorCode === '0') {
                this.pageName = 'STEPPER';
                this.step++;
                this.isSuccess = true;
            } else {
                this.pageName = 'STEPPER';
                this.step++;
                this.isSuccess = false;
            }
        })

    }

    private fetchLanguage() {
        this.language = this.translate.currentLang;
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(
                (lang) => {
                    this.language = lang.lang
                }
            ));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    canProceed(){
        return !this.disabled && this.validOTP()
    }

    validOTP(){
        if(this.pageName === 'OTP'){
            return this.requestValidate.valid()
        }
        return true
    }

}
