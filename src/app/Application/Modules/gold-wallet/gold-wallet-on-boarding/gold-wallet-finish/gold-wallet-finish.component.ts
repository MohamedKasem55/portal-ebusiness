import {Component, Input, OnInit} from '@angular/core';
import {GoldWalletOnBoardingRequestDTO} from "../../model/gold-wallet-on-boarding-request-d-t-o";
import {WalletOnBoardingConfirmRes} from "../../model/wallet-on-boarding-confirm-res";

@Component({
    selector: 'arb-gold-wallet-finish',
    templateUrl: './gold-wallet-finish.component.html',
    styleUrls: ['./gold-wallet-finish.component.scss']
})
export class GoldWalletFinishComponent implements OnInit {
    @Input()
    goldWalletOnBoardingRequest: GoldWalletOnBoardingRequestDTO;
    @Input()
    walletOnBoardingConfirmRes: WalletOnBoardingConfirmRes
    @Input() success: boolean = true;

    constructor() {
    }

    ngOnInit(): void {
    }

}
