import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {GoldWalletOnBoardingRequestDTO} from "../../model/gold-wallet-on-boarding-request-d-t-o";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {GoldWalletService} from "../../service/gold-wallet.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {GoldWalletBuyRequestDTO} from "../../model/gold-wallet-buy-request-dto";

@Component({
    selector: 'arb-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {

    blob: any;
    docURL: SafeResourceUrl;
    subscriptions: Subscription[] = [];
    language: string;
    @Input()
    goldWalletBuyRequest: GoldWalletBuyRequestDTO;
    @Output()
    changeGoldWalletBuyRequest: EventEmitter<GoldWalletBuyRequestDTO> = new EventEmitter<GoldWalletBuyRequestDTO>();

    constructor(public config: ConfigResourceService,
                private goldWalletService: GoldWalletService,
                private santizer: DomSanitizer,
                private router: Router,
                private translate: TranslateService) {
        this.language = translate.currentLang;
        this.subscriptions.push(
            this.goldWalletService.getTermsAndConditions('gold-wallet-' + this.language + '.pdf').subscribe(
                (res) => {
                    this.docURL = this.printPdf(res)
                }
            ))
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

    getRenderedTermsAndConditions() {
        this.subscriptions.push(
            this.goldWalletService.getTermsAndConditions('gold-wallet-' + this.language + '.pdf').subscribe(
                (res) => {
                    this.docURL = this.printPdf(res)
                }
            ))
    }

    openTermsConditions() {
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

    onChange(event) {
        this.goldWalletBuyRequest.termsAndConditionAccepted = event;
        this.changeGoldWalletBuyRequest.emit(this.goldWalletBuyRequest);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
    }
}
