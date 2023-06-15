import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {
    AbstractWizardInitiatorModifyComponent
} from "../../../Common/Components/Abstract/Initiator/abstract-wizard-initiator-modify.component";
import {TranslateService} from "@ngx-translate/core";
import {CurrentAccountsService} from "../../../Accounts/accounts-current-account/accounts-current-account.service";
import {BillPaymentService} from "../bill-payments/bill-payment.service";
import {FormBuilder} from "@angular/forms";
import {StaticService} from "../../../Common/Services/static.service";
import {Router} from "@angular/router";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";

@Component({
    selector: 'arb-bill-detail-payments',
    templateUrl: './bill-detail.component.html',
    styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailsPaymentsComponent implements OnInit{

    @Input() step = 2
    @Input() bills: any = []
    @Input() totalAmount: number = 0
    @Input() selectedAccount: any = {}
    @Input() showDelete: boolean = false
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge
    @Input() requestValidate = new RequestValidate()
    @Input() isOneTimePayment = false

    @Output() onDelete = new EventEmitter<any>()


    authorization: any

    @ViewChild('authorization') set content(content) {
        this.authorization = content
    }


    constructor(
        public translate: TranslateService,
        public accountService: CurrentAccountsService,
    ) {

    }

    ngOnInit(): void {
        if(this.isOneTimePayment&&this.step===2)
            this.bills[0].billAmount=undefined
    }

    delete(bill, index) {
        this.onDelete.emit({bill, index})
    }

    isValidAuthorization() {
        if (this.authorization) {
            return this.authorization.valid()
        } else {
            return true
        }
    }

}
