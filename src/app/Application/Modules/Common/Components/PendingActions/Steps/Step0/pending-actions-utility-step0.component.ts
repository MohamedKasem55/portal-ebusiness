import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Abstract/abstract-datatable-mobile.component'
import { PendingActionsUtilityService } from '../../pending-actions-utility.service'
import { PagedData } from '../../../../../../Model/paged-data'
import { Page } from '../../../../../../Model/page'

@Component({
  selector: 'app-pending-actions-utility-step0',
  templateUrl: './pending-actions-utility-step0.component.html',
  styleUrls: ['./pending-actions-utility-step0.component.scss'],
})
export class PendingActionsUtilityStep0Component
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() service: PendingActionsUtilityService

  @Input() fieldsConfigForSearchForm: any[]

  @Input() fieldsConfigForList: any[]

  @Input() combosData: any

  @Input() translate_prefix = 'pendingActions'

  @Input() custom_fields_templates: any = {}

  @Input() table_allow_link_to_detail: any = true

  @Input() step0_table_externalPaging = true
  @Input() step0_table_externalSorting = true

  @Output() onSelectPendingActions = new EventEmitter<any>()
  @Output() onClickPendingAction = new EventEmitter<any>()
  @Output()
  onAllSearchFieldsCreated: EventEmitter<any> = new EventEmitter<any>()
  @Output()
  onInitSearchFormFieldsUtility: EventEmitter<any> = new EventEmitter<any>()

  @Input() hasSearchFilters = true

  @Input() search_form_collapsed: any = false

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()
    //this.reset();
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  getId(row) {
    return this.service.getId(row)
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  onSelect({ selected }: { selected: any }) {
    super.onSelect({ selected })
    this.onSelectPendingActions.emit(selected)
  }

  isSelectItemsAllowed() {
    return this.service.isSelectItemsAllowed()
  }

  getExportColumns() {
    const exportColumns = this.service.getExportColumns()
    const exportDataTableColumns = []
    if (exportColumns.length > 0) {
      exportColumns.forEach((_fieldConfig) => {
        exportDataTableColumns.push({
          title: this.translate.instant(_fieldConfig.title_translate_key),
          dataKey: _fieldConfig.dataKey,
          transformFn: _fieldConfig.transformFn,
          modelKey: _fieldConfig.modelKey,
          dateFormat: _fieldConfig.dateFormat,
          width: _fieldConfig.width,
        })
      })
    }
    return exportDataTableColumns
  }

  getExportHeader() {
    return this.service.getExportHeader()
  }

  showExportButtons(): boolean {
    return this.service.showExportButtons()
  }

  getPdfPageSize() {
    return this.service.getPdfPageSize()
  }

  onClickRow(row: any, propName = null) {
    this.onClickPendingAction.emit(row)
  }

  allFieldsCreated($event) {
    this.onAllSearchFieldsCreated.emit($event)
  }

  initFormFieldsUtility($event) {
    this.onInitSearchFormFieldsUtility.emit($event)
  }

  onTableSetPage($event) {
    // console.log("onTableSetPage", $event);
    if (this.step0_table_externalPaging && this.step0_table_externalSorting) {
      this.setPage($event)
    } else {
      this.elementsPage.page.pageNumber =
        $event && $event.offset ? $event.offset + 1 : 1
      this.elementsPage.page.pageSize =
        $event && $event.pageSize
          ? $event.pageSize
          : this.elementsPage.page.pageSize
    }
  }

  onTableSetSort($event) {
    // console.log("onTableSetSort", $event);
    if (this.step0_table_externalPaging && this.step0_table_externalSorting) {
      this.setSort($event)
    } else {
      this.elementsPage.page.pageNumber =
        $event && $event.offset ? $event.offset + 1 : 1
      this.elementsPage.page.pageSize =
        $event && $event.pageSize
          ? $event.pageSize
          : this.elementsPage.page.pageSize
    }
  }

  onTableFooterChangePageSize($event) {
    // console.log("onTableFooterChangePageSize", $event);
    this.elementsPage.page.pageSize = $event.pageSize
  }
}
