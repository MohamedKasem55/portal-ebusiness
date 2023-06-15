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
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { AbstractDatatableMobileComponent } from '../../../Abstract/abstract-datatable-mobile.component'
import { PendingActionsUtilityService } from '../../pending-actions-utility.service'

@Component({
  selector: 'app-pending-actions-utility-step2',
  templateUrl: './pending-actions-utility-step2.component.html',
  styleUrls: ['./pending-actions-utility-step2.component.scss'],
})
export class PendingActionsUtilityStep2Component
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() service: PendingActionsUtilityService

  @Input() fieldsConfigForSearchForm: any[]

  @Input() fieldsConfigForList: any[]

  @Input() itemsSelected: any[]

  @Input() operation: any

  @Input() combosData: any

  @Input() translate_prefix = 'pendingActions'

  @Input() editable = false

  @Output() onClickPendingAction = new EventEmitter<any>()

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()
    this.reset()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  //----------------------------------------

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    const pagedData = new PagedData<any>()
    const pageObject = new Page()

    pageObject.pageNumber = 1
    pageObject.pageSize = this.itemsSelected.length
    pageObject.size = this.itemsSelected.length
    pageObject.totalElements = this.itemsSelected.length
    pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

    pagedData.data = this.itemsSelected
    pagedData.page = pageObject
    this.elementsPage = pagedData
  }

  getId(row) {
    return this.service.getId(row)
  }

  onClickRow(row, propName = null) {
    this.onClickPendingAction.emit(row)
  }

  reset() {
    this.search()
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
    //console.log(exportDataTableColumns);
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
}
