import {Component, OnInit} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {Subscription} from 'rxjs'
import {BulkPaymentService} from '../../bulk-payment.service'

@Component({
    templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {

    step = 1
    sharedData: any = {}

    pendingSubscriptions: Subscription
    pageResult: any = {}
    tableDisplaySize = 20

    constructor(
        private service: BulkPaymentService,
        public translate: TranslateService,
    ) {
    }

    ngOnInit(): void {
        this.pageResult.items = []
        this.pageResult.size = 0
        this.pageResult.total = 0

        this.sharedData.tableSelected = []

        this.setPage(null)
    }

    setPage(pageInfo) {
        if (pageInfo == null) {
            pageInfo = {offset: 0}
        }

        this.pendingSubscriptions = this.service
            .getPending(pageInfo.offset + 1, this.tableDisplaySize)
            .subscribe((result) => {
                if (!result.error) {
                    this.pageResult = result.pendingBulkPaymentsList
                    //console.log(this.pageResult);
                }
                this.pendingSubscriptions.unsubscribe()
            })
    }

    onSelect({selected}) {
        //console.log('Select Event', selected, this.tableSelectedRows);
        this.sharedData.tableSelected.splice(
            0,
            this.sharedData.tableSelected.length,
        )
        this.sharedData.tableSelected.push(...selected)
        //console.log(this.sharedData);
    }

    changeDisplaySize(event) {
        this.tableDisplaySize = event
        this.setPage(null)
    }

    onDetailLinkClicked(row: any) {
        this.service.pendingActionDetail(row)
            .subscribe((result) => {
                if (!result.error) {
                    this.sharedData.bulkPaymentsBatchDetail = {
                        bulkPaymentsDetailsDTO: result.bulkPaymentsDetailsDTO,
                        fileLinesList: result.fileLinesList,
                        bulkPaymentsParameters: result.bulkPaymentsParameters,
                        bulkPaymentsBatchDSO: result.bulkPaymentsBatchDSO,
                    };
                }
            })
    }
}
