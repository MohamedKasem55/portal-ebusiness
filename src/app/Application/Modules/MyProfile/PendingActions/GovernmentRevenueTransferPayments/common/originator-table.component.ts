import {Component, Input, OnInit} from '@angular/core'
import {DatatableMobileComponent} from '../../../../../../core/responsive/datatable-mobile.component'
import {
    DepositorOriginator,
    OriginatorType,
} from '../model/depositor-originator'

@Component({
    selector: 'app-originator-table',
    templateUrl: './originator-table.component.html',
})
export class OriginatorTableComponent extends DatatableMobileComponent implements OnInit {
    @Input() originator: DepositorOriginator
    @Input() showName = false
    @Input() type: OriginatorType = OriginatorType.BENEFICIARY
    OriginatorType = OriginatorType

    ngOnInit() {
        super.ngOnInit();
    }

    getOriginator(): any[] {
        if (this.originator) {
            return [this.originator]
        }
        return []
    }
}
