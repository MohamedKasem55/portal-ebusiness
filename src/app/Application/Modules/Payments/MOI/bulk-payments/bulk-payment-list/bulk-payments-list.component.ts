import {Component, Input} from '@angular/core';

import {CurrentAccountsService} from "../../../../Accounts/accounts-current-account/accounts-current-account.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'arb-bulk-list-payments',
    templateUrl: './bulk-payments-list.component.html',
    styleUrls: ['./bulk-payments-list.component.scss']
})
export class BulkPaymentsListComponent {


    public defaultHeight: any = 'auto'
    @Input() bills: any = []
    @Input() showLevels :boolean

    constructor(
        public translate: TranslateService,
    ) {
    }

    openModal(row, popup) {
        popup.openModal(row)
    }
}