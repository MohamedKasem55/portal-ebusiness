import {
    Component,
    EventEmitter, Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { EtradeService } from "../../../Services/workflow/etrade/etrade.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'

@Component({
    selector: 'app-etrade-step1',
    templateUrl: './etrade-step1.component.html',
})
export class EtradeStep1Component extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    // @ViewChild('changeValuesModal', { static: true })
    @ViewChild('table', { static: false }) table: any
    @Input() companyDetails: any = null
    @Input() step: number = 0
    @Output() onInit = new EventEmitter<Component>()
    public changeValuesModal: ModalDirective
    public defaultColumnMode = ColumnMode.force
    public footerHeight = window.innerWidth < 800 ? 150 : 74
    public defaultHeight: any = 'auto'
    modifyArray: any = []
    messageError = {}
    subscriptions: Subscription[] = []
    notModify = true;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public services: EtradeService,
        public translate: TranslateService,
    ) {
        super()
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    ngOnInit() {
        super.ngOnInit()
        this.onInit.emit(this as Component)
    }

    onError(error: any) {
        const res = error
        this.messageError['code'] = res.error.errorCode
        this.messageError['description'] = res.error.errorDescription
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }


    public verifyItem(i, rowIndex, event): void {
        if (this.notModify) {
            this.formModify()
        }
        const items = this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows
        if (this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows[rowIndex].amount === event) {
            this.notModify = true;
        } else {
            this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows[rowIndex].amount = event;

            const index = this.modifyArray.findIndex(obj => obj.companyEtradeFunctionsPk === this.companyDetails["companyEtradeFunctionList"][i].companyEtradeFunctionsPk)
            if (index !== -1) {
                this.modifyArray[index].companyEtradeWorkflows[rowIndex].amount = event
            } else {
                this.modifyArray.push(this.companyDetails["companyEtradeFunctionList"][i])
            }
            const itemChange = this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows[rowIndex]
            items.forEach((item, j) => {
                if (j !== 0 && (items[j - 1].error === 1 || this._parseFloat(items[j].amount) <= this._parseFloat(items[j - 1].amount))) {
                    items[j].error = 1
                } else {
                    items[j].error = 0
                }
            })
        }
    }

    public addItem(i): void {
        if (this.notModify) {
            this.formModify()
        }
        const items = this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows
        if (items.length < 5) {
            const amount = (items.length <= 0 ? 0.00 : +(+items[items.length - 1].amount + 0.01).toFixed(2));
            items.push({
                "companyEtradeWorkflowPk": items.length + 1,
                "amount": amount,
                "oldAmount": 0.00,
                "level": items.length + 1,
                "error": 0
            })
        }
        this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows = [...items]
        const index = this.modifyArray.findIndex(obj => obj.companyEtradeFunctionsPk === this.companyDetails["companyEtradeFunctionList"][i].companyEtradeFunctionsPk)
        if (index !== -1) {
            this.modifyArray[index] = this.companyDetails["companyEtradeFunctionList"][i]
        } else {
            this.modifyArray.push(this.companyDetails["companyEtradeFunctionList"][i])
        }
    }

    public canAddItem(i): boolean {
        const items = this.companyDetails["companyEtradeFunctionList"][i].companyEtradeWorkflows
        return (items.length < 5);
    }

    formModify() {
        this.notModify = false;
    }

    _parseFloat(value: any) {
        return parseFloat(value)
    }

    public getRowIndex(row: any): number {
        return this.table.bodyComponent.getRowIndex(row);
    }
}
