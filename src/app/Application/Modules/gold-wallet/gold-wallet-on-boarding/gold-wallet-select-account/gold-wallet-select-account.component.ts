import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoldWalletOnBoardingRequestDTO} from "../../model/gold-wallet-on-boarding-request-d-t-o";
import { GoldWalletService } from '../../service/gold-wallet.service';

@Component({
    selector: 'arb-gold-wallet-select-account',
    templateUrl: './gold-wallet-select-account.component.html',
    styleUrls: ['./gold-wallet-select-account.component.scss']
})
export class GoldWalletSelectAccountComponent implements OnInit {

    @Input()
    goldWalletOnBoardingRequest: GoldWalletOnBoardingRequestDTO;
    @Output()
    changeGoldWalletOnBoardingRequest: EventEmitter<GoldWalletOnBoardingRequestDTO> = new EventEmitter<GoldWalletOnBoardingRequestDTO>();

    selectedAccount: any = {};
    accounts = [];


    constructor(public service: GoldWalletService) {
    }

    ngOnInit(): void {
        this.changeGoldWalletOnBoardingRequest.emit(this.goldWalletOnBoardingRequest);
        this.initiateAccounts()
    }

    initiateAccounts() {
        this.service.getSARAccounts().subscribe(result => {
          if(result.errorCode == '0'){
            this.accounts = result.listAlertsPermissionAccount
          }
        })
    }

    selectAccount(account) {
        this.selectedAccount = account;
        this.goldWalletOnBoardingRequest.account = account;
        this.changeGoldWalletOnBoardingRequest.emit(this.goldWalletOnBoardingRequest);
    }

}
