import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {GoldWalletService} from "../service/gold-wallet.service";
import {Router} from "@angular/router";
import {DatatableMobileComponent} from "../../../../core/responsive/datatable-mobile.component";
import {PagedData} from "../../../Model/paged-data";
import {Page} from "../../../Model/page";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {GoldWalletDashboardRes} from "../model/gold-wallet-dashboard-res";
import {GoldWalletFilterType, GoldWalletTransactionsReq} from "../model/gold-wallet-transactions-req";
import {GoldWalletTransactionsRes} from "../model/gold-wallet-transactions-res";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'arb-gold-dashboard',
    templateUrl: './gold-dashboard.component.html',
    styleUrls: ['./gold-dashboard.component.scss']
})
export class GoldDashboardComponent extends DatatableMobileComponent implements OnInit, OnDestroy {


    rows = new PagedData();
    tableDisplaySize = 10;

    selectedTransaction: any = [];
    trnxType: any;
    walletDashboard: GoldWalletDashboardRes = new GoldWalletDashboardRes();
    goldWalletTransactionsRes: GoldWalletTransactionsRes = new GoldWalletTransactionsRes();
    currentLang: string;
    language = "";
    walletDashboardResponse: GoldWalletDashboardRes = new GoldWalletDashboardRes();

    constructor(public goldWalletService: GoldWalletService,
                public translate: TranslateService,
                public router: Router,private smq:SimpleMQ) {

        super();
        smq.publish('loader-mq',true);
        this.fetchLanguage();
        this.rows.page = new Page();
        this.goldWalletService.getWalletDashboard().subscribe(
            (res: any) => {
                this.setObjects(res)
            });
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.updateLang()
        })

    }

    fetchLanguage() {
        this.language = this.translate.currentLang;
        this.subscriptions.push(
            this.translate.onLangChange.subscribe(
                (lang) => {
                    this.language = lang.lang
                    this.setObjects(this.walletDashboardResponse);
                }
            ));
    }

    setPage(pageInfo) {
        if (pageInfo == null) {
            pageInfo = {offset: 0}
        }
        return pageInfo;
    }

    changeDisplaySize() {
        this.rows.page.pageSize = this.tableDisplaySize;
        this.setPage(this.rows.page)
    }

    onSelect(rows) {
    }

    getId(row) {
        return row['code']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        localStorage.removeItem('gold-wallet');
    }

    viewDetails(trnx) {
        this.goldWalletService.setTransaction(trnx);
        void this.router.navigate(['gold-wallet/trnx-details'])
    }

    navigateToTrnxTypeExecution() {
        if (this.trnxType === 'buy') {
            void this.router.navigate(['/gold-wallet/buy'], {state: {data: this.walletDashboard}})
        } else if (this.trnxType === 'sell') {
            void this.router.navigate(['/gold-wallet/sell']);
        }

    }

    updateLang() {
        this.currentLang = this.translate.currentLang
        this.walletDashboard.marketInformation.marketPrice = "";
        this.walletDashboard.marketInformation.buyPrice = "";
        this.walletDashboard.marketInformation.sellPrice = "";
        this.setTranslatedPrices()
    }

    getCurrentLang() {
        return this.currentLang
    }

    loadLastTransactions() {
        if (this.walletDashboard.walletNum) {
            const request = new GoldWalletTransactionsReq();
             request.filterType = GoldWalletFilterType.LAST_TRANSACTION;


            request.page = 1;
            request.walletNum = this.walletDashboard.walletNum;
            this.goldWalletService.getWalletTransactions(request).subscribe((res: any) => {
                this.goldWalletTransactionsRes = res;
                this.rows.page.pageSize = this.tableDisplaySize;
                this.rows.data = new Array<object>();
                if (request.filterType === GoldWalletFilterType.MY_GOLD) {
                    this.rows.data = this.goldWalletTransactionsRes.myGold?.items
                    this.rows.page.totalElements = this.goldWalletTransactionsRes.myGold?.size;
                } else {
                    this.rows.data = this.goldWalletTransactionsRes.myLastTransaction?.items
                    this.rows.page.totalElements = this.goldWalletTransactionsRes.myLastTransaction?.size;
                }
            })
        }
    }

    setObjects(res: any) {

        this.walletDashboard.walletNum = res.walletNum;
        this.walletDashboard.goldBalance = res.goldBalance;
        this.walletDashboard.linkedAccountNumber = res.linkedAccountNumber;
        this.walletDashboard.marketInformation = res.marketInformation;
        this.walletDashboardResponse = JSON.parse(JSON.stringify(this.walletDashboard));
        this.goldWalletService.setDashboardObject(this.walletDashboard);

        this.setTranslatedPrices();

        this.loadLastTransactions();
    }

    setTranslatedPrices() {
        this.walletDashboard.marketInformation.marketPrice =
            this.walletDashboardResponse.marketInformation.marketPrice
            + ' ' + this.translate.instant('gold-wallet.sar');
        this.walletDashboard.marketInformation.buyPrice =
            this.walletDashboardResponse.marketInformation.buyPrice
            + ' ' + this.translate.instant('gold-wallet.sar');
        this.walletDashboard.marketInformation.sellPrice =
            this.walletDashboardResponse.marketInformation.sellPrice
            + ' ' + this.translate.instant('gold-wallet.sar');
    }
}
