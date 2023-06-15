import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {DataTableWraperComponent} from '../../../../../Components/common/data-table-wrapper.component'
import {DatatableComponent} from '@swimlane/ngx-datatable'
import {Subject, Subscription} from 'rxjs'
import {TransfersService} from '../transfers.service'
import {ModalDirective} from "ngx-bootstrap/modal";

@Component({
    selector: 'app-transfer-common-table',
    templateUrl: './transfer-common-table.component.html',
    styleUrls: ['./transfer-common-table.styles.scss']
})
export class TransferCommonTableComponent
    extends DataTableWraperComponent
    implements OnInit, OnDestroy {
    @Input('showRate') showRate = false

    @Input('actionText') actionText = null

    @ViewChild('table', {static: true}) table: DatatableComponent
    @ViewChild('remarksPopup', { static: true }) remarksModal: ModalDirective
    remarksToShow: string
    selectAllOnPage: any = []
    tableSelectedRows: any = []
    selectedSubscription: Subscription
    colWidth: any = 20;
    transferTypeWidth: any = 120;
    sourceAndDestinationWidth: any = 220;
    amountWidth: any = 120;

    constructor(
        public translate: TranslateService,
        public service: TransfersService,
    ) {
        super()
        matchMedia('(max-width: 800px)').addListener(((mql) => {
            if (mql.matches) {
                this.colWidth = '';
                this.transferTypeWidth = '';
                this.sourceAndDestinationWidth = '';
                this.amountWidth = ''
            } else {
                this.colWidth = 20
                this.transferTypeWidth = 120;
                this.sourceAndDestinationWidth = 220;
                this.amountWidth = 120;
            }
        }));
    }

    ngOnDestroy() {
        this.selectedSubscription.unsubscribe()
    }

    ngOnInit(): void {
        super.ngOnInit()
        this.selectedSubscription = this.service.getSelected.subscribe(
            (selected) => {
                if (selected.length == 0) {
                    this.selectAllOnPage = []
                }
            },
        )
    }

    getId(row) {
        return row['batchPk']
    }

    openModal(
        row,
        popup: { openModal: { (arg0: any): void; (arg0: any): void } },
    ) {
        if (this.futureLevels) {
            popup.openModal(row.futureSecurityLevelsDTOList)
        } else {
            popup.openModal(row.securityDetails)
        }
    }

    openRemarksModal(remarks: string){
        this.remarksToShow = remarks
        this.remarksModal.show()
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    onCustomInnerSelect({selected}) {
        // console.log('Inner select',event);
        this.selectAllOnPage[this.table.offset] = false
        this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
        this.tableSelectedRows.push(...selected)
        this.service.setSelected(this.tableSelectedRows)
    }

    selectAll(event) {
        if (!this.selectAllOnPage[this.table.offset]) {
            // Unselect all so we dont get duplicates.
            if (this.tableSelectedRows.length > 0) {
                this.items.map((transfer) => {
                    this.tableSelectedRows = this.tableSelectedRows.filter(
                        (selected) => this.getId(selected) !== this.getId(transfer),
                    )
                })
            }
            // Select all again
            this.tableSelectedRows.push(...this.items)
            this.selectAllOnPage[this.table.offset] = true
            // console.log('-----------Select All----');
            // console.log(this.tableSelectedRows);
        } else {
            // Unselect all
            this.items.map((transfer) => {
                this.tableSelectedRows = this.tableSelectedRows.filter(
                    (selected) => this.getId(selected) !== this.getId(transfer),
                )
            })
            this.selectAllOnPage[this.table.offset] = false
            // console.log('-----------UnSelect All');
            // console.log(this.tableSelectedRows);
        }
        this.service.setSelected(this.tableSelectedRows)
    }
}
