import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {GoldWalletService} from "../service/gold-wallet.service";
import {GoldDetails} from "../model/gold-wallet-transactions-res";
import {GoldWalletDashboardRes} from "../model/gold-wallet-dashboard-res";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'arb-transaction-details',
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

    subscriptions: Subscription[] = [];
    language: string;
    transaction: GoldDetails;
    goldWalletDashboardRes: GoldWalletDashboardRes;

    constructor(private translate: TranslateService, private router: Router, private goldWalletService: GoldWalletService) {
        this.transaction = goldWalletService.getTransaction();
        this.goldWalletDashboardRes = this.goldWalletService.getDashBoardObject();
        if (!this.transaction || !this.goldWalletDashboardRes) {
            void this.router.navigate(['/gold-wallet/dashboard'])
        }
        this.fetchLanguage();
    }

    ngOnInit(): void {
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

    back() {
        void this.router.navigate(['/gold-wallet/dashboard'])
    }
}
