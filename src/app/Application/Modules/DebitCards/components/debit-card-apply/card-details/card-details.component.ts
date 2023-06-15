import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DebitCardApplyService} from "../debit-card-apply.service";
import {ApplyMadaCard} from "../apply-mada-card";
import {TranslateService} from "@ngx-translate/core";
import { CurrentAccountsService } from '../../../../Accounts/accounts-current-account/accounts-current-account.service'
import {Router} from "@angular/router";

@Component({
    selector: 'arb-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit, OnChanges {

    @Input() applyMadaCardRequest: ApplyMadaCard;
    @Output() onApplyRequest: EventEmitter<any> = new EventEmitter<any>();
    accounts = [];
    embossingNames: any = [];
    selectedAccount: any = {};
    selectedEmbossingName: any;
    acceptedTermsAndConditions = false;

    detailsDetails = new FormGroup({
        embossingName: new FormControl('', Validators.required),
        termsAccept: new FormControl('', Validators.required),
        selectAccount: new FormControl('', Validators.required),
    });

    constructor(public fb: FormBuilder,
                public service: DebitCardApplyService,
                public translate: TranslateService,
                public currentAccountsService: CurrentAccountsService,
                public router: Router) {
        this.applyMadaCardRequest = new ApplyMadaCard();
    }

    ngOnInit(): void {
        this.service.initializeApplyMadaDebitCard().subscribe((res: any) => {
            if(res.errorCode != 0){
                this.router.navigateByUrl('/')
            } else {
                this.embossingNames = res.embossingNames;
                this.accounts = res.accounts;
                this.applyMadaCardRequest.gender = res.gender;
            }
        });
    }

    ngOnChanges(): void {
        if (this.applyMadaCardRequest) {
            this.selectedAccount = this.applyMadaCardRequest.account;
            this.selectedEmbossingName = this.applyMadaCardRequest.embossingName
            this.acceptedTermsAndConditions = this.applyMadaCardRequest.acceptedTermsAndConditions;
        }
    }

    openTermsConditions() {
        if (this.translate.currentLang.toLowerCase().includes("en")) {
            this.service.getTermsAndConditions('SME-Debit-Card-TC-v-16-EN.pdf',
                'Mada Debit Card Terms and Conditions').subscribe();
        } else {
            this.service.getTermsAndConditions('SME-Debit-Card-TC-v16-AR.pdf',
                'شروط واحكام استخراج مدى كارت').subscribe();
        }
    }

    selectAccount(account) {
        this.selectedAccount = account
        this.applyMadaCardRequest.account = this.selectedAccount;
        this.emitChanges();
    }

    onSelectEmbossingName() {
        this.applyMadaCardRequest.embossingName = this.selectedEmbossingName;
        this.emitChanges();
    }

    onAcceptingTermsAdnConditions() {
        this.applyMadaCardRequest.acceptedTermsAndConditions = this.detailsDetails.controls.termsAccept.value;
        this.emitChanges();
    }

    emitChanges() {
        this.applyMadaCardRequest.step = 1;
        this.onApplyRequest.emit(this.applyMadaCardRequest);
    }
}
