import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GoldWalletService} from "../../service/gold-wallet.service";
import {DatatableMobileComponent} from "../../../../../core/responsive/datatable-mobile.component";
import {GoldWalletDashboardRes} from "../../model/gold-wallet-dashboard-res";
import {SellRequestDTO} from "../../model/sell-request-dto";
import {Page} from "../../../../Model/page";
import {PagedData} from "../../../../Model/paged-data";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'arb-sell-gold',
    templateUrl: './sell-gold.component.html',
    styleUrls: ['./sell-gold.component.scss']
})
export class SellGoldComponent extends DatatableMobileComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    transactionListAfterEdit: any[];

    @Input()
    sellRequestDTO: SellRequestDTO;

    tableDisplaySize

    rows = new PagedData();

    timeToLive: any;

    goldWalletDashboardRes: GoldWalletDashboardRes;

    constructor(private goldWalletService: GoldWalletService, private router: Router, private translate: TranslateService) {
        super();
        this.goldWalletDashboardRes = this.goldWalletService.getDashBoardObject();
        if (!this.goldWalletDashboardRes?.marketInformation?.marketPrice) {
            this.router.navigate(['/gold-wallet/dashboard']);
        }
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngOnChanges(): void {
        this.timeToLive = this.sellRequestDTO.sellGoldValidateRes.timeToLive;
        this.rows.page = new Page();
        this.rows.data = this.transactionListAfterEdit;
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

    redirectToWalletDashboard() {
        this.router.navigate(['/gold-wallet/dashboard']);
    }
}
