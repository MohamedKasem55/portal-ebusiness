import {
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core'
import {FormArray} from '@angular/forms'
import {DatatableComponent} from '@swimlane/ngx-datatable'
import {DatatableMobileComponent} from '../../../../../../core/responsive/datatable-mobile.component'

@Component({
    selector: 'app-revenue-accounts-table',
    templateUrl: './revenue-accounts-table.component.html',
})
export class RevenueAccountsTableComponent
    extends DatatableMobileComponent
    implements OnInit {
    @ViewChild('table', {static: true}) table: DatatableComponent

    @Input() subAccountAmounts: FormArray
    @Input() editView = true

    innerWidth: any
    mobile: boolean

    constructor() {
        super()
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    onDetailToggle(event) {
        //console.log("onDetailToggle",event);
    }
}
