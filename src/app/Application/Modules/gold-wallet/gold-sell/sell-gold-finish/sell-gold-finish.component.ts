import {Component, Input, OnInit} from '@angular/core';
import {GoldWalletBuyRequestDTO} from "../../model/gold-wallet-buy-request-dto";
import {SellRequestDTO} from "../../model/sell-request-dto";

@Component({
    selector: 'arb-sell-gold-finish',
    templateUrl: './sell-gold-finish.component.html',
    styleUrls: ['./sell-gold-finish.component.scss']
})
export class SellGoldFinishComponent implements OnInit {

    @Input()
    isSuccessOnBoarding;
    @Input()
    sellRequestDTO: SellRequestDTO;

    constructor() {
    }

    ngOnInit(): void {
    }

}
