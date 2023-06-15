import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {DataTableWraperComponent} from 'app/Application/Components/common/data-table-wrapper.component'

@Component({
    selector: 'app-bulkPayment-table',
    templateUrl: './bulk-payment-table.component.html',
})
export class BulkPaymentTableComponent
    extends DataTableWraperComponent
    implements OnInit {

    itemsSelected: any[] = [];

    @Input() showDetailLink = false;

    @Output() onDetailLinkClicked: EventEmitter<string> = new EventEmitter();

    constructor(public translate: TranslateService) {
        super()
    }

    ngOnInit(): void {
        super.ngOnInit()
    }

    getId(row) {
        return row['batchPk']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    onInnerSelect(event: any) {
        super.onInnerSelect(event);
    }

    detailLinkClicked(row: any) {
        this.onInnerSelect({
            selected: [row]
        });
        const itemsSelected = [];
        itemsSelected.push(row);
        this.itemsSelected = itemsSelected;
        this.onDetailLinkClicked.emit(row);
    }
}
