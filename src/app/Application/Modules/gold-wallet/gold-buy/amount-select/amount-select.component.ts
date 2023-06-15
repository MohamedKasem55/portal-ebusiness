import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoldWalletService} from "../../service/gold-wallet.service";
import {Bullion, BullionWeight, GoldWalletBullionRes} from "../../model/gold-wallet-bullion-res";
import {GoldWalletBuyRequestDTO} from "../../model/gold-wallet-buy-request-dto";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'arb-amount-select',
    templateUrl: './amount-select.component.html',
    styleUrls: ['./amount-select.component.scss']
})
export class AmountSelectComponent implements OnInit {

    goldWalletBullionRes: GoldWalletBullionRes = new GoldWalletBullionRes();
    @Input()
    language: string;
    @Input()
    goldWalletBuyRequest: GoldWalletBuyRequestDTO;
    @Output()
    changeGoldWalletBuyRequest: EventEmitter<GoldWalletBuyRequestDTO> = new EventEmitter<GoldWalletBuyRequestDTO>();


    customType: FormGroup;

    selectedBullion: number;
    customKGAmountSelected: boolean = false;
    customGMAmountSelected: boolean = false;


    constructor(private goldWalletService: GoldWalletService, private fb: FormBuilder) {
        this.goldWalletService.getAvailableGoldBullion().subscribe(
            (res: any) => {
                this.goldWalletBullionRes = res;
                this.goldWalletBuyRequest.goldWalletBullionRes = res;
            }
        )
    }

    ngOnInit(): void {
        this.customType = new FormGroup({
            'kgCustom': this.fb.control('',
                [Validators.required,
                    Validators.max(this.goldWalletBullionRes.availableFreeWeight.balance)]),
            'gmCustom': this.fb.control('', [Validators.required, Validators.min(5),
                Validators.max(this.goldWalletBullionRes.availableFreeWeight.balance)])
        });
    }

    changeSelection(event, customType: string) {
        if (customType.toLowerCase().includes('custom')) {
            if (customType.includes('kg')) {
                this.selectedBullion = this.customType.get('kgCustom').value * 1000
                this.customKGAmountSelected = true;
                this.customGMAmountSelected = false;
            } else {
                this.selectedBullion = this.customType.get('gmCustom').value
                this.customGMAmountSelected = true;
                this.customKGAmountSelected = false;
            }
            this.goldWalletBuyRequest.requestedBullion.custom = true;
        } else {
            this.customKGAmountSelected = false;
            this.customGMAmountSelected = false;
            this.selectedBullion = JSON.parse(event.target.defaultValue);
            this.goldWalletBuyRequest.requestedBullion.custom = false;
        }
        this.goldWalletBuyRequest.requestedBullion.selectedBullion = this.selectedBullion;
        this.changeGoldWalletBuyRequest.emit(this.goldWalletBuyRequest)
    }

    validMaxAmount(type) {
        if (type === "kg") {
            return (this.customType.get('kgCustom').value) > (this.goldWalletBullionRes.availableFreeWeight.balance / 1000);
        } else if (type === "gm") {
            return (this.customType.get('gmCustom').value) > (this.goldWalletBullionRes.availableFreeWeight.balance);
        }
        return false;
    }

    get kgCustom() {
        return this.customType.get('kgCustom');
    }

    get gmCustom() {
        return this.customType.get('gmCustom');
    }


}
