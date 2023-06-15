import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
    selector: 'arb-select-fractions',
    templateUrl: './select-fractions.component.html',
    styleUrls: ['./select-fractions.component.scss']
})
export class SelectFractionsComponent implements OnInit,OnChanges {


    @Input()
    transactionList: any[];

    @Output()
    onChangeTransactions: EventEmitter<any> = new EventEmitter<any>();
    totalAmountToSell: number;


    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        this.calculateSellAmount();
    }

    onAmountChange() {
        this.onChangeTransactions.emit(this.transactionList);
        this.calculateSellAmount();
    }

    calculateSellAmount() {
        this.totalAmountToSell = 0;
        for (let trnx of this.transactionList) {
            this.totalAmountToSell += (trnx.selectedValue) ? trnx.selectedValue : trnx.amount;
        }
    }
}
