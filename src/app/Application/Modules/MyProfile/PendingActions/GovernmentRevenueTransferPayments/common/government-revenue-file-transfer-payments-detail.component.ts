import {Component, Input, OnInit} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {RevenueAccount} from '../../../../GovernmentRevenue/Model/revenue-account'
import {OriginatorType} from '../../../../GovernmentRevenue/Model/depositor-originator'
import {GovernmentRevenueTransferPaymentsService} from '../government-revenue-transfer-payments.service'

@Component({
    selector: 'app-government-revenue-file-transfer-payments-detail',
    templateUrl: './government-revenue-file-transfer-payments-detail.component.html',
})
export class GovernmentRevenueFileTransferPaymentsDetailComponent
    implements OnInit {
    @Input() payment
    @Input() error
    // @Input() sharedForm: FormGroup;
    @Input() revenueAccounts: RevenueAccount[]

    OriginatorType = OriginatorType

    constructor(
        private service: GovernmentRevenueTransferPaymentsService,
        public translate: TranslateService,
    ) {
    }

    ngOnInit(): void {
    }

    getControlValue(property) {
        if (this.payment[property]) {
            return this.payment[property]
        } else {
            return ''
        }
    }

    getDateControlValue(controlName): any {
        return this.service.dateFormatter.format(this.getControlValue(controlName))
    }

    get subAccountAmounts(): any {
        return this.payment['details']
    }

    get company() {
        return this.service.company
    }
}
