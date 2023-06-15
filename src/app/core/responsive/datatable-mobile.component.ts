import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    Directive,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core'
import {ColumnMode, DatatableComponent, SelectionType,} from '@swimlane/ngx-datatable'
import {Subscription} from 'rxjs';
import {Exception} from '../../Application/Model/exception';

@Directive()
export abstract class DatatableMobileComponent
    implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    static platformId

    @ViewChild('elementsTable') table: any

    @ViewChildren(DatatableComponent)
    innerTablesQuery: QueryList<DatatableComponent>
    public innerTables: DatatableComponent[] = []

    public innerWidth: any
    public innerWidthEarlier: any
    public mobile = window.innerWidth < 800
    public tables: any[] = []
    public visiblePagesCount = 5
    public footerHeight = window.innerWidth < 800 ? 150 : 74
    public shouldCollapse = !(window.innerWidth < 800)
    public defaultColumnMode = ColumnMode.force
    public defaultSelectionType = SelectionType.checkbox
    public defaultSelectionTypeSingle = SelectionType.single
    public defaultSelectionTypeCell = SelectionType.cell
    public defaultHeight: any = 'auto'
    public defaultWidth: any = 'auto'

    @Output() onInit = new EventEmitter<Component>()

    protected subscriptions: Subscription[] = []

    messageError: any = {}

    constructor() {
        this.innerWidth = window.innerWidth
    }

    ngOnInit() {
        // -------------------------------------
        window.addEventListener('resize', (res: Event) => {
            this.resizeAllTables()
        })
        // -------------------------------------
        this.onInit.emit(this as Component)
        // -------------------------------------
    }

    ngAfterViewInit() {
        this.innerTablesQuery.changes.subscribe((items: DatatableComponent[]) => {
            this.innerTables = []
            items.forEach((item: DatatableComponent, i) => {
                this.innerTables.push(item)
            })
            this.resizeAllTables()
        })
        this.innerTables = []
        this.innerTablesQuery.map((item) => {
            this.innerTables.push(item)
            return item
        })
        this.resizeAllTables()
    }

    ngAfterViewChecked() {
    }

    onAllTablesResized() {
    }

    resizeAllTables() {
        this.innerWidth = window.innerWidth
        if (this.innerWidthEarlier != this.innerWidth) {
            this.innerWidthEarlier = window.innerWidth
        } else {
            if (!this.mobile) {
                return null
            }
        }
        const tables = this.getContainedTables()
        if (this.innerWidth < 800) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < tables.length; ++i) {
                const table = tables[i]
                if (table && table.rowDetail) {
                    table.rowDetail.expandAllRows()
                    if (table.groupExpansionDefault === true) {
                        table.rowDetail.collapseAllRows()
                    }
                }
            }
            setTimeout(() => {
                this.shouldCollapse = false
                this.mobile = true
                this.visiblePagesCount = 5
                this.footerHeight = 150
                this.onAllTablesResized()
            }, 200)
        } else {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < tables.length; ++i) {
                const table = tables[i]
                if (table && table.rowDetail) {
                    table.rowDetail.collapseAllRows()
                }
            }
            setTimeout(() => {
                this.shouldCollapse = true
                this.mobile = false
                this.visiblePagesCount = 5
                this.footerHeight = 74
                this.onAllTablesResized()
            }, 200)
        }
    }

    protected getContainedTables(): any[] {
        const tables = this.getAllTables()
        const innerTables = this.getInnerTables()
        const allTables = []
        allTables.push(...tables)
        allTables.push(...innerTables)
        return allTables
    }

    public getAllTables(): any[] {
        return []
    }

    protected getInnerTables(): any[] {
        return this.innerTables ? this.innerTables : []
    }

    onDetailToggle(event) {
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    protected onError(response: any): void {
        if (!response) {
            this.messageError = {
                code: '',
                description: ''
            }
            return;
        }
        if (response instanceof Exception) {
            this.messageError = {
                code: response.errorCode,
                description: response.errorDescription
            }
            return;
        }
        if (response?.error instanceof Exception) {
            this.messageError = {
                code: response?.error.errorCode,
                description: response?.error.errorDescription
            }
            return;
        }
        if (response?.errorCode && response?.errorDescription) {
            this.messageError = {
                code: response?.errorCode,
                description: response?.errorDescription
            }
            return;
        }
    }

    protected cleanError(): void {
        this.messageError = {}
    }

    protected hasError(response: any) {
        if (response === null || response === undefined) {
            return true;
        }
        if (response instanceof Exception) {
            return true;
        }
        if (response.hasOwnProperty('error') && response.error instanceof Exception) {
            return true;
        }
        if (response.hasOwnProperty('errorCode') && response.errorCode != '0') {
            return true;
        }
        return false;
    }
}
