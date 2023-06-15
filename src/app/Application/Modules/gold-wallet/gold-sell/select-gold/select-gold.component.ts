import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {GoldWalletService} from "../../service/gold-wallet.service";
import {GoldWalletDashboardRes} from "../../model/gold-wallet-dashboard-res";
import {Router} from "@angular/router";
import {GoldWalletBullionRes} from "../../model/gold-wallet-bullion-res";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {DatatableMobileComponent} from "../../../../../core/responsive/datatable-mobile.component";
import {PagedData} from "../../../../Model/paged-data";
import {Page} from "../../../../Model/page";
import {GoldWalletFilterType, GoldWalletTransactionsReq} from "../../model/gold-wallet-transactions-req";
import {GoldDetails, GoldWalletTransactionsRes, SellTransactionsRes} from "../../model/gold-wallet-transactions-res";

@Component({
    selector: 'arb-select-gold',
    templateUrl: './select-gold.component.html',
    styleUrls: ['./select-gold.component.scss']
})
export class SelectGoldComponent extends DatatableMobileComponent implements OnInit, OnDestroy {
    @Output()
    onTransactionSelection: EventEmitter<any[]> = new EventEmitter<any[]>();

    isAllSelected: boolean = false
    rows = new PagedData();
    tableDisplaySize = 10;
    goldWalletTransactionsRes: SellTransactionsRes = new SellTransactionsRes();
    selectedTransaction: any = [];
    selectedRows = [];
    goldWalletDashboardRes: GoldWalletDashboardRes = new GoldWalletDashboardRes();
    goldWalletBullionRes: GoldWalletBullionRes = new GoldWalletBullionRes();
    language: string;
    subscriptions: Subscription[] = [];
    activeTab = 1;
    myGoldFixed: GoldDetails[] = [];
    myGoldFree: GoldDetails[] = [];
    myGoldFixedSize: number = 0;
    myGoldFreeSize: number = 0;
    selectedBullionAmount: number;

    constructor(private goldWalletService: GoldWalletService, private router: Router, private translate: TranslateService) {
        super();
        this.rows.page = new Page();
        this.goldWalletDashboardRes = this.goldWalletService.getDashBoardObject()
        if (!this.goldWalletDashboardRes?.marketInformation?.marketPrice) {
            this.router.navigate(['/gold-wallet/dashboard'])
        } else {
            const request = new GoldWalletTransactionsReq();
            request.page = 1;
            request.walletNum = this.goldWalletDashboardRes.walletNum;
            request.filterType = GoldWalletFilterType.MY_GOLD_SEG;
            this.goldWalletService.getWalletTransactions(request).subscribe((res: any) => {

                this.goldWalletTransactionsRes = res;

                this.rows.page.pageSize = this.tableDisplaySize;
                this.rows.data = new Array<object>();

                this.myGoldFixed = this.goldWalletTransactionsRes.myGoldFixed?.items;
                this.myGoldFree = this.goldWalletTransactionsRes.myGoldFree?.items;

                this.myGoldFixedSize = this.goldWalletTransactionsRes.myGoldFixed?.size;
                this.myGoldFreeSize = this.goldWalletTransactionsRes.myGoldFree?.size;
                this.switchTab(1);
            })
        }
        this.fetchLanguage();
    }

    ngOnInit(): void {
        super.ngOnInit()
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

    setPage(pageInfo) {
        if (pageInfo == null) {
            pageInfo = {offset: 0};
        }
        return pageInfo;
    }

    getId(row) {
        return row['code'];
    }

    getIdFunction() {
        return this.getId.bind(this);
    }

    changeDisplaySize() {
        this.rows.page.pageSize = this.tableDisplaySize;
        this.setPage(this.rows.page);
    }


    selectAll(): void {
        this.isAllSelected = !this.isAllSelected;
        this.rows.data.forEach((item: any) => {
            item.enabled = this.isAllSelected
        });
        if (!this.isAllSelected) {
            this.selectedRows = [];
        } else {
            this.selectedRows = this.rows.data;
        }
        this.selectedRows.forEach(obj => {
            obj.selectedValue = obj.amount;
        })
        this.onTransactionSelection.emit(this.selectedRows);
    }

    changeSelection(row) {
        this.isAllSelected = false;
        row.enabled = !row.enabled;
        this.isAllSelected = this.isAllSelected && row.enabled;
        this.validateSelectedRows();
    }

    validateSelectedRows() {
        for (const row of this.rows.data) {
            const indexExisted = this.selectedRows.indexOf(row);
            if ((indexExisted === -1) && row['enabled']) {
                if (this.activeTab == 1) {
                    this.selectedBullionAmount = row['amount']
                }
                row['selectedValue'] = row['amount'];
                this.selectedRows.push(row)
            } else if ((indexExisted !== -1) && !row['enabled']) {
                if (this.selectedRows.length == 1) {
                    this.selectedBullionAmount = null
                }
                this.selectedRows.splice(indexExisted)
            }
        }
        this.onTransactionSelection.emit(this.selectedRows);
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        switch (tabId) {
            case 1:
                this.resetRows()
                this.rows.page.pageSize = this.tableDisplaySize;
                this.rows.data = new Array<object>();
                this.rows.data = this.myGoldFixed;
                this.rows.page.totalElements = this.myGoldFixedSize;
                break;
            case 2:
                this.resetRows()
                this.rows.page.pageSize = this.tableDisplaySize;
                this.rows.data = new Array<object>();
                this.rows.data = this.myGoldFree;
                this.rows.page.totalElements = this.myGoldFreeSize;
                break;
        }
    }

    isTabActive(tabId) {
        return this.activeTab == tabId
    }

    getCurrentLang() {
        return this.language
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.subscriptions.forEach(subs => {
            subs.unsubscribe()
        })
    }

    private resetRows() {
        this.selectedRows = [];
        this.selectedBullionAmount = null;
        this.rows.data.forEach((row)=>{
            row['enabled']=false;
        });
    }
}
