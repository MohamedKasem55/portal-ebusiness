import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core'
import {LangChangeEvent, TranslateService} from '@ngx-translate/core'
import {Subscription} from 'rxjs'
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Exception} from '../../../../Model/exception';

@Directive()
export abstract class AbstractAppComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {

    @Input() translate_prefix = null

    protected subscriptions: Subscription[] = []

    messageError: any = {}

    _firstChange = true

    @ViewChildren(DatatableComponent) innerTablesQuery: QueryList<DatatableComponent>;
    public innerTables: DatatableComponent[] = [];
    public innerWidth: any
    public innerWidthEarlier: any
    public mobile = window.innerWidth < 800
    public shouldCollapse = !(window.innerWidth < 800)
    public visiblePagesCount = 5
    public footerHeight = window.innerWidth < 800 ? 150 : 74

    @Output() onInit = new EventEmitter<Component>()

    protected constructor(public translate: TranslateService) {
    }

    ngOnInit() {
        // -------------------------------------
        this.subscriptions.push(
            this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.refreshData()
            }),
        )
        this.refreshData()
        // -------------------------------------
        this.innerWidth = window.innerWidth
        window.addEventListener('resize', (res: Event) => {
            this.resizeAllTables()
        })
        // -------------------------------------
        this.onInit.emit(this as Component)
        // -------------------------------------
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._firstChange) {
            this._firstChange = false
        } else {
            this.refreshData();
        }
    }

    ngAfterViewInit() {
        this.innerTablesQuery.changes.subscribe((items: DatatableComponent[]) => {
            this.innerTables = [];
            items.forEach((item: DatatableComponent, i) => {
                this.innerTables.push(item);
            });
            this.resizeAllTables();
        });
        this.innerTables = [];
        this.innerTablesQuery.map((item) => {
            this.innerTables.push(item);
            return item;
        })
        this.resizeAllTables();
    }

    ngAfterViewChecked() {
        // this.resizeAllTables();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    refreshData() {
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

    scrollToTop() {
        window.scrollTo(0, 0)
        /*
            const _scrollToTop = window.setInterval(() => {
                const pos = window.pageYOffset;
                if (pos > 0) {
                    window.scrollTo(0, pos - 20); // how far to scroll on each step
                } else {
                    window.clearInterval(_scrollToTop);
                }
            }, 3);
             */
    }

    getUnescapedStr(str) {
        const txt = document.createElement('textarea')
        txt.innerHTML = unescape(str)
        return txt.value
    }

    public getTableCurrentPageSize(table) {
        if (table && table.bodyComponent && table.bodyComponent.temp) {
            return table.bodyComponent.temp.length
        }
        return 0
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
                this.onAllTablesResized();
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
                this.onAllTablesResized();
            }, 200)
        }
    }

    protected getContainedTables(): any[] {
        const tables = this.getAllTables();
        const innerTables = this.getInnerTables();
        const allTables = [];
        allTables.push(...tables);
        allTables.push(...innerTables);
        return allTables;
    }

    public getAllTables(): any[] {
        return []
    }

    protected getInnerTables(): any[] {
        return this.innerTables ? this.innerTables : []
    }
}
