import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {ApplyMadaCard} from "../apply-mada-card";
import {DebitCardApplyService} from "../debit-card-apply.service";
import {Page} from "../../../../../Model/page";
import {PagedData} from "../../../../../Model/paged-data";

@Component({
    selector: 'arb-select-pick-up',
    templateUrl: './select-pick-up.component.html',
    styleUrls: ['./select-pick-up.component.scss']
})
export class SelectPickUpComponent
    extends DatatableMobileComponent implements OnInit, OnChanges, OnDestroy {


    @Input() applyMadaCardRequest: ApplyMadaCard;
    @Input() selectedBranches: any[] = [];
    @Output() onApplyRequest: EventEmitter<any> = new EventEmitter<any>();

    tableDisplaySize = 10;
    rows = new PagedData();
    originalRows = new PagedData();
    selectedCity;
    cities = [];
    branchesWithoutFilter: any[] = [];
    branchFilter: String = "";

    constructor(
        public translate: TranslateService,
        public debitCardApplyService: DebitCardApplyService) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit()

        this.emitChanges();
        this.rows.page = new Page()
        this.rows.page.pageSize = this.tableDisplaySize
        this.rows.data = new Array<object>();

        this.getAllCities()
    }

    ngOnChanges(): void {

    }

    setPage(pageInfo) {
        if (pageInfo == null) {
            pageInfo = {offset: 0}
        }
        return pageInfo;
    }

    onSelect(rows) {
        rows.selected[0].selected = !rows.selected[0].selected
        if (rows && rows.selected[0].selected) {
            this.applyMadaCardRequest.branch = rows.selected[0];
            this.selectedBranches = rows.selected
        } else {
            this.applyMadaCardRequest.branch = undefined;
        }
        this.emitChanges();
    }


    getId(row) {
        return row['code']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    changeDisplaySize(event) {
        this.tableDisplaySize = event
        this.setPage(event)
    }

    emitChanges() {
        this.applyMadaCardRequest.step = 2;
        this.onApplyRequest.emit(this.applyMadaCardRequest);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    getAllCities() {
        this.debitCardApplyService.getAllCitiesOfBranches().subscribe((res: any) => {
            // eslint-disable-next-line guard-for-in
            for (const city in res.props) {
                this.cities.push({city});
            }
        })
    }


    fetchBranches() {
        this.debitCardApplyService.getBranchList(this.selectedCity).subscribe((res: any) => {
            // eslint-disable-next-line guard-for-in
            this.rows.data = [];
            for (const code in res.props) {
                this.rows.data.push({branch: res.props[code], code, selected: false});
            }
            this.rows.page.totalElements = this.rows.data.length;
            this.originalRows = Object.create(this.rows);
        })
    }

    filterBranchList(text) {
        this.rows = Object.create(this.originalRows);
        this.rows.data = this.rows.data.filter((row: any) => row.branch.toLowerCase().includes(this.branchFilter.toLowerCase()));
        this.rows.page.totalElements = this.rows.data.length;
    }

}
