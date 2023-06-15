import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {DomSanitizer} from "@angular/platform-browser";
import {GoldWalletService} from "../../service/gold-wallet.service";
import {Router} from "@angular/router";
import {GoldWalletOnBoardingRequestDTO} from "../../model/gold-wallet-on-boarding-request-d-t-o";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'arb-gold-wallet-terms-and-conditions',
    templateUrl: './gold-wallet-terms-and-conditions.component.html',
    styleUrls: ['./gold-wallet-terms-and-conditions.component.scss']
})
export class GoldWalletTermsAndConditionsComponent implements OnInit, OnDestroy {


    subscriptions: Subscription[] = [];
    language: string;
    acceptedTermsAndConditions = false;
    blob: any;
    docURL: any;
    detailsDetails = new FormGroup({
        termsAccept: new FormControl('', Validators.required),
    });
    @Input()
    goldWalletOnBoardingRequest: GoldWalletOnBoardingRequestDTO;
    @Output()
    changeGoldWalletOnBoardingRequest: EventEmitter<GoldWalletOnBoardingRequestDTO> =
        new EventEmitter<GoldWalletOnBoardingRequestDTO>();


    constructor(public config: ConfigResourceService,
                private goldWalletService: GoldWalletService,
                private santizer: DomSanitizer,
                private router: Router,
                private translate: TranslateService) {
        this.language = translate.currentLang;
        this.getRenderedTermsAndConditions();
        this.fetchLanguage();
    }

    fetchLanguage() {
        this.language = this.translate.currentLang;
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(
                (lang) => {
                    this.language = lang.lang
                    this.getRenderedTermsAndConditions();
                }
            ));
    }

    ngOnInit(): void {
    }

    printPdf(blob: Blob) {
        const blobURL = URL.createObjectURL(blob)
        const url = window.location.href
        const docURL =
            url.replace('#' + this.router.url, '') +
            'viewer/viewer.html?file=' +
            blobURL

        return this.santizer.bypassSecurityTrustResourceUrl(docURL)
    }

    downloadTermsConditions() {
        if (this.language === 'en') {
            this.subscriptions.push(
                this.goldWalletService.downloadTermsAndConditions('gold-wallet-' + this.language + '.pdf',
                    'Gold Wallet Terms and conditions').subscribe());
        } else {
            this.subscriptions.push(
                this.goldWalletService.downloadTermsAndConditions('gold-wallet-' + this.language + '.pdf',
                    'شروط وأحكام محفظة الذهب'
                ).subscribe());
        }
    }

    onAcceptingTermsAndConditions() {
        this.acceptedTermsAndConditions = this.detailsDetails.controls.termsAccept.value;
        this.goldWalletOnBoardingRequest.termsAndConditionAccepted = this.detailsDetails.controls.termsAccept.value;
        this.changeGoldWalletOnBoardingRequest.emit(this.goldWalletOnBoardingRequest);
    }

    getRenderedTermsAndConditions() {
        this.subscriptions.push(
            this.goldWalletService.getTermsAndConditions('gold-wallet-' + this.language + '.pdf').subscribe(
                (res) => {
                    this.docURL = this.printPdf(res)
                }
            ))
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
    }


}
