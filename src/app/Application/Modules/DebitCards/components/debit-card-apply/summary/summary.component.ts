import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RequestValidate} from "../../../../../Model/requestvalidateType";
import {ResponseGenerateChallenge} from "../../../../../Model/responsegeneratechallenge.type";
import {ApplyMadaCard} from "../apply-mada-card";
import {CurrentAccountsService} from "../../../../Accounts/accounts-current-account/accounts-current-account.service";

@Component({
    selector: 'arb-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {
    @Input() applyMadaCardRequest: ApplyMadaCard;
    @Input() requestValidate: RequestValidate = new RequestValidate();
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge;

    constructor() {
    }

    ngOnInit(): void {
        this.requestValidate.valid();
    }

    ngOnChanges(): void {
    }

}
