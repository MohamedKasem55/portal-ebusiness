import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {GoldWalletBuyRequestDTO} from "../../model/gold-wallet-buy-request-dto";
import {GoldWalletDashboardRes} from "../../model/gold-wallet-dashboard-res";
import {Router} from "@angular/router";

@Component({
    selector: 'arb-validation-receipt',
    templateUrl: './validation-receipt.component.html',
    styleUrls: ['./validation-receipt.component.scss']
})
export class ValidationReceiptComponent implements OnInit, OnChanges {

    @Input()
    goldWalletBuyRequest: GoldWalletBuyRequestDTO;

    @Input()
    walletDashboard:GoldWalletDashboardRes;

    @Output()
    changeGoldWalletBuyRequest: EventEmitter<GoldWalletBuyRequestDTO> = new EventEmitter<GoldWalletBuyRequestDTO>();

    @Input()
    language

    timeToLive: number
    constructor(private router:Router) {
    }

    ngOnInit() {
    }

    ngOnChanges(): void {
        if (this.goldWalletBuyRequest.buyGoldValidateRes.timeToLive) {
            this.timeToLive = parseInt(this.goldWalletBuyRequest.buyGoldValidateRes.timeToLive);
        }
    }
    redirectToWalletDashboard() {
        this.router.navigate(['/gold-wallet/dashboard']);
    }
}
