import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { AbstractAppComponent } from '../Abstract/abstract-app.component'
import { FormGroup } from '@angular/forms'
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'

@Component({
  selector: 'app-dynamic-searchable-table',
  templateUrl: './dynamic-searchable-table.component.html',
  styleUrls: ['./dynamic-searchable-table.component.scss'],
})
export class DynamicSearchableTableComponent
  extends AbstractAppComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('searchPanel') searchPanel: SearchablePanelComponent

  @ViewChild('dynamicExtraFormFields') _dynamicExtraFormFields: any

  @Input() showSearchForm = true

  @Input() searchForm_checkValid = true

  @Input() searchForm: FormGroup = null

  @Input() fieldsConfigForSearchForm: any[] = []

  @Input() search_form_custom_fields_templates: any = {}

  @Input() search_form_translate_prefix: any = 'public'

  @Input() search_form_combosData: any = {}

  @Input() search_form_collapsed: any = false

  @Output() onSubmitSearchForm = new EventEmitter<any>()

  @Output() onResetSearchForm = new EventEmitter<any>()

  @Output() onSearchFormAllFieldsCreated = new EventEmitter<any>()

  @Output() onSearchFormInited = new EventEmitter<any>()

  // ----------------------------------------------------------------

  @ViewChild('elementsTable') _elementsTable: DatatableComponent

  @Input() table_title: any = null

  // ----------------------------------------------------------------

  @Input() table_export_show_buttons: any = true

  @Input() table_export_header: any = ''

  @Input() table_export_columns: any[] = []

  @Input() table_export_selected_rows: any[] = []

  @Input() table_export_pdf_size: any = 'A4'

  // ----------------------------------------------------------------

  @Input() table_empty_data_message: any = 'public.noData'

  @Input() table_columnMode: any = ColumnMode.force

  @Input() table_selectionType: any = SelectionType.checkbox

  @Input() table_selection_disabled = false

  @Input() table_rowIdentity: (x: any) => any

  @Input() table_rowHeight: any = 'auto'

  @Input() table_headerHeight: any = 'auto'

  @Input() table_footerHeight: number = 70

  @Input() table_externalPaging = true

  @Input() table_externalSorting = true

  @Input() table_elements_rows: any[] = []

  @Input() table_elements_selected_rows: any[] = []

  @Input() table_elements_count: number = 0

  @Input() table_elements_offset: number = 0

  @Input() table_elements_limit: number = 0

  @Input() table_hasFixedColumns: boolean = false

  @Input() table_reset_selected_on_search: boolean = false

  @Input() table_reset_selected_on_reset: boolean = false

  @Input() table_allow_link_to_detail: boolean = true

  @Output() onTablePage = new EventEmitter<any>()

  @Output() onTableSort = new EventEmitter<any>()

  @Output() onTableSelect = new EventEmitter<any>()

  @Output() onTableDetailToggle = new EventEmitter<any>()

  // ----------------------------------------------------------------

  @Input() fieldsConfigForList: any[] = []

  @Input() service: any

  @Input() combosData: any

  @Output() onTableClickRowDetail = new EventEmitter<any>()

  @Input() table_translate_prefix = ''

  // ----------------------------------------------------------------

  @Input() table_footer_show_buttons = true

  @Input() table_footer_pageSize: number = 50

  @Input() table_footer_visiblePagesCount: number = 5

  @Output() onTableFooterChangePageSize = new EventEmitter<any>()

  // ----------------------------------------------------------------

  public innerWidth: any
  public innerWidthEarlier: any
  public mobile = window.innerWidth < 800
  public tables: any[] = []
  public visiblePagesCount = 5
  public footerHeight = window.innerWidth < 800 ? 150 : 74
  public shouldCollapse = !(window.innerWidth < 800)

  constructor(public translate: TranslateService) {
    super(translate)
    this.innerWidth = window.innerWidth
  }

  // ----------------------------------------------------------------
  ngOnInit() {
    super.ngOnInit()
    // -------------------------------------
    window.addEventListener('resize', (res: Event) => {
      this.resizeAllTables()
    })
    // -------------------------------------
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
    if (this.search_form_collapsed) {
      setTimeout(() => {
        this.searchPanel.isCollapsedContent = true
      }, 200)
    }
    this.resizeAllTables()
  }

  search() {
    if (this.table_reset_selected_on_search) {
      this._elementsTable.selected = []
      this.onSelect({ selected: [] })
    }
    this.onSubmitSearchForm.emit(this.searchForm)
  }

  reset() {
    if (this.table_reset_selected_on_reset) {
      this._elementsTable.selected = []
      this.onSelect({ selected: [] })
    }
    this.onResetSearchForm.emit(this.searchForm)
  }

  searchFormCreated($event) {
    this.onSearchFormAllFieldsCreated.emit($event)
  }

  searchFormInited($event) {
    this.onSearchFormInited.emit($event)
  }

  isSelectItemsAllowed() {
    return this.service && this.service.isSelectItemsAllowed()
  }

  // ----------------------------------------------------------------

  public getTable() {
    return this._elementsTable
  }

  public getDynamicExtraFormFields() {
    return this._dynamicExtraFormFields
  }

  setPage($event) {
    this.onTablePage.emit($event)
  }

  setSort($event) {
    this.onTableSort.emit($event)
  }

  onSelect($event) {
    this.onTableSelect.emit($event)
  }

  onDetailToggle($event) {
    this.onTableDetailToggle.emit($event)
  }

  // ----------------------------------------------------------------

  onClickRow(row, propName) {
    this.onTableClickRowDetail.emit({
      row,
      propName,
    })
  }

  // ----------------------------------------------------------------

  onChangePageSize($event) {
    this.onTableFooterChangePageSize.emit({
      pageSize:
        +($event && $event.taget && $event.target.value
          ? $event.target.value
          : this.table_footer_pageSize)
    })
    this.setPage(null)
  }

  // ----------------------------------------------------------------

  public getTableCurrentPageSize(table) {
    if (table && table.bodyComponent && table.bodyComponent.temp) {
      return table.bodyComponent.temp.length
    }
    return 0
  }

  public getTranslationKey(prefix, key) {
    if (!prefix || prefix === null || prefix === undefined || prefix === '') {
      return key
    }
    return prefix + '.' + key
  }

  public getAllTables(): any[] {
    const tables = []
    tables.push(this._elementsTable)
    return tables
  }

  protected getContainedTables(): any[] {
    const tables = this.getAllTables()
    const allTables = []
    allTables.push(...tables)
    return allTables
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
}
