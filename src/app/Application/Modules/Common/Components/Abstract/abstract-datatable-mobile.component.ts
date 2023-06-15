import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component';
import { AuthenticationService } from '../../../../../core/security/authentication.service';
import { PagedData } from '../../../../Model/paged-data';
import { Exception } from '../../../../Model/exception';

@Directive()
export abstract class AbstractDatatableMobileComponent
    extends DatatableMobileComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() translate_prefix = null;

    @ViewChild('elementsTable') table: any;

    @ViewChildren(DatatableComponent) innerTablesQuery: QueryList<DatatableComponent>;
    public _innerTables: DatatableComponent[] = [];

    public defaultColumnMode = ColumnMode.force;
    public defaultSelectionType = SelectionType.checkbox;
    public defaultSelectionTypeSingle = SelectionType.single;
    public defaultSelectionTypeCell = SelectionType.cell;

    elementsPage: PagedData<any> = new PagedData<any>();

    searchForm: FormGroup;
    searchFormData: any;

    tableSelectedRows = [];
    tableSelectedRowsLastSelected: any[] = [];
    @Output() onSelectItems: EventEmitter<any> = new EventEmitter<any>();

    selectAllOnPage: any = [];

    order: string;
    orderType: string;

    protected constructor(
        public fb: FormBuilder,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router
    ) {
        super();

        this.elementsPage = new PagedData<any>();
        this.searchForm = this.fb.group({});
    }

    ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(
            this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.refreshData();
            })
        );
        this.refreshData();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit()
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    refreshData() {
    }

    public getAllTables(): any[] {
        return super.getAllTables();
    }

    setPage(dataTableEvent) {
        this.searchForm.markAllAsTouched();
        if (this.searchForm.invalid) {
            this.elementsPage = {
                page: {
                    size: 0,
                    totalElements: 0,
                    totalPages: 0,
                    pageNumber: 1,
                    pageSize: this.elementsPage && this.elementsPage.page && this.elementsPage.page.pageSize ? this.elementsPage.page.pageSize : 50
                },
                data: []
            };
        } else {
            if (dataTableEvent == null) {
                dataTableEvent = { offset: 0 };
            }
            if (!dataTableEvent.offset) {
                dataTableEvent.offset = 0;
            }
            this.elementsPage.page.pageNumber = dataTableEvent.offset;
            this.searchFormData = Object.assign({}, this.searchForm.getRawValue());
            this.getList(
                this.searchFormData,
                this.order,
                this.orderType,
                dataTableEvent.offset + 1,
                this.elementsPage.page.pageSize
            );
        }
    }

    setSort(dataTableEvent) {
        if (this.elementsPage.data.length != 0) {
            if (dataTableEvent.sorts[0]) {
                this.order = dataTableEvent.sorts[0].prop;
                this.orderType = dataTableEvent.sorts[0].dir;
            }
            this.setPage(Object.assign({}, dataTableEvent, { offset: dataTableEvent.offset ? dataTableEvent.offset : 0 }));
        }
    }

    abstract getList(searchElement, order, orderType, offset, pageSize);

    search() {
        this.setPage({
            offset: 0,
            rows: this.elementsPage && this.elementsPage.page && this.elementsPage.page.pageSize ? this.elementsPage.page.pageSize : 50
        });
    }

    reset() {
        this.searchForm.reset();
        this.search();
    }

    onError(result) {
    }

    getTableSelectionType() {
        return this.defaultSelectionType;
    }

    onSelect({ selected }) {
        if (this.getTableSelectionType() === this.defaultSelectionTypeSingle) {
            if (this.tableSelectedRowsLastSelected.length > 0) {
                if (this.getId(this.tableSelectedRowsLastSelected[0]) === this.getId(selected[0])) {
                    this.tableSelectedRowsLastSelected = [];
                    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
                    this.tableSelectedRows.push(...[])
                } else {
                    this.tableSelectedRowsLastSelected = [...selected];
                    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
                    this.tableSelectedRows.push(...selected)
                }
            } else {
                this.tableSelectedRowsLastSelected = [...selected];
                this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
                this.tableSelectedRows.push(...selected)
            }
        } else {
            this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
            this.tableSelectedRows.push(...selected)
        }
        this.onSelectItems.emit([...this.tableSelectedRows]);
    }

    selectAll($event) {
        const tableSelectedRows = this.getSelectedRows();
        if (!this.selectAllOnPage[this.getElementsPageCurrentNumber()]) {
            // Unselect all so we dont get duplicates.
            if (tableSelectedRows.length > 0) {
                this.getElementsPageCurrentData().map((row) => {
                    const cleanSelectedRows = tableSelectedRows.filter(
                        // tslint:disable-next-line:no-shadowed-variable
                        (selected) => this.getId(selected) !== this.getId(row),
                    )
                    tableSelectedRows.splice(0, tableSelectedRows.length);
                    tableSelectedRows.push(...cleanSelectedRows);
                })
            }
            // Select all again
            tableSelectedRows.push(...this.getElementsPageCurrentData())
            this.selectAllOnPage[this.getElementsPageCurrentNumber()] = true
            // console.log('-----------Select All----');
            // console.log(this.tableSelected);
        } else {
            // Unselect all
            this.getElementsPageCurrentData().map((row) => {
                const cleanSelectedRows = tableSelectedRows.filter(
                    // tslint:disable-next-line:no-shadowed-variable
                    (selected) => this.getId(selected) !== this.getId(row),
                )
                tableSelectedRows.splice(0, tableSelectedRows.length);
                tableSelectedRows.push(...cleanSelectedRows);
            })
            this.selectAllOnPage[this.getElementsPageCurrentNumber()] = false
            // console.log('-----------UnSelect All');
            // console.log(this.tableSelected)
        }

        const selected = tableSelectedRows.filter((row) => this.canSelectRowItem(row));
        tableSelectedRows.splice(0, tableSelectedRows.length);
        tableSelectedRows.push(...selected);
        this.checkIfAllAreSelected();
    }

    checkIfAllAreSelected(): void {
        // check if all allowed items are selected on current page
        const tableSelectedRows = this.getSelectedRows();
        console.log('🚀 ~ file: abstract-datatable-mobile.component.ts ~ line 200 ~ checkIfAllAreSelected ~ tableSelectedRows', tableSelectedRows)
        const elementPageData = this.getElementsPageCurrentData();
        console.log('🚀 ~ file: abstract-datatable-mobile.component.ts ~ line 202 ~ checkIfAllAreSelected ~ elementPageData', elementPageData)
        let all_selected = true;
        let one_selected = false;
        elementPageData.forEach((row) => {
            if (this.canSelectRowItem(row)) {
                const find = tableSelectedRows.find(
                    (selected) => this.getId(selected) === this.getId(row),
                )
                if (find) {
                    one_selected = true;
                } else if (!find) {
                    all_selected = false;
                    this.selectAllOnPage[this.getElementsPageCurrentNumber()] = false
                }
            }
        })
        if (all_selected && one_selected) {
            this.selectAllOnPage[this.getElementsPageCurrentNumber()] = true
        }
    }

    getElementsPageCurrentNumber(): number {
        const elementsPage = this.getElementsPage();
        console.log('🚀 ~ file: abstract-datatable-mobile.component.ts ~ line 225 ~ getElementsPageCurrentNumber ~ elementsPage', elementsPage)
        if (!elementsPage) {
            throw new Exception('-1',
                'You must Implement getElementsPage() method on your Component');
        }
        return elementsPage && elementsPage.page ? elementsPage.page.pageNumber : 0;
    }

    getElementsPageCurrentData(): any[] {
        console.log('aqui');
        const elementsPage = this.getElementsPage();
        if (!elementsPage) {
            throw new Exception('-1',
                'You must Implement getElementsPage() method on your Component');
        }
        return elementsPage && elementsPage.data ? elementsPage.data : [];
    }

    getIdFunction() {
        return this.getId.bind(this);
    }

    abstract getId(row): any;

    staticRecoverValues(combos, data, label) {
        const auxData = [];
        const index = Object.keys(data[combos.indexOf(label)]['values']).sort(
            (a, b) => {
                return data[combos.indexOf(label)]['values'][a] >
                    data[combos.indexOf(label)]['values'][b]
                    ? 1
                    : data[combos.indexOf(label)]['values'][b] >
                        data[combos.indexOf(label)]['values'][a]
                        ? -1
                        : 0;
            }
        );
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index.length; i++) {
            auxData.push({
                key: index[i],
                value: data[combos.indexOf(label)]['values'][index[i]]
            });
        }
        return auxData;
    }

    getUnescapedStr(str) {
        const txt = document.createElement('textarea');
        txt.innerHTML = unescape(str);
        return txt.value;
    }

    public getTableCurrentPageSize(table) {
        if (table && table.bodyComponent && table.bodyComponent.temp) {
            return table.bodyComponent.temp.length;
        }
        return 0;
    }

    public canSelectRowItem(row: any): boolean {
        return true
    }

    public getElementsPage() {
        return this.elementsPage;
    }

    public getSelectedRows(): any[] {
        return this.tableSelectedRows;
    }
}
