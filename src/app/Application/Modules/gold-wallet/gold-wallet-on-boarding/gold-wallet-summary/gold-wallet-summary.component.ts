import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoldWalletOnBoardingRequestDTO} from "../../model/gold-wallet-on-boarding-request-d-t-o";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";

@Component({
    selector: 'arb-gold-wallet-summary',
    templateUrl: './gold-wallet-summary.component.html',
    styleUrls: ['./gold-wallet-summary.component.scss']
})
export class GoldWalletSummaryComponent implements OnInit {
    @Input()
    goldWalletOnBoardingRequest: GoldWalletOnBoardingRequestDTO
    @Output()
    changeGoldWalletOnBoardingRequest: EventEmitter<GoldWalletOnBoardingRequestDTO> = new EventEmitter<GoldWalletOnBoardingRequestDTO>();
    constructor() {
    }

    ngOnInit(): void {
    }

}
