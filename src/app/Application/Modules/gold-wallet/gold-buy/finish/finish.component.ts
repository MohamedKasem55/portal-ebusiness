import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GoldWalletBuyRequestDTO} from "../../model/gold-wallet-buy-request-dto";

@Component({
    selector: 'arb-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit, OnChanges {

    @Input()
    isSuccessOnBoarding;
    @Input()
    goldWalletBuyRequest: GoldWalletBuyRequestDTO;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {

    }

}
