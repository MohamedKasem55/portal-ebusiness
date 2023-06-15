import {
  Attribute,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { LetterGuaranteeListService } from './letter-guarantee-list.service'
import {saveAs} from "file-saver";

@Component({
  selector: 'app-letter-guarantee-list',
  templateUrl: './letter-guarantee-list.component.html',
  styleUrls: ['./letter-guarantee-list.component.scss'],
})
export class LetterGuaranteeListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  combosKeys: any[] = []
  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  routes: any[] = [
    ['letter_guarantee.menu'],
    ['letter_guarantee.download-templates'],
  ]

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: LetterGuaranteeListService,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'name'
    this.orderType = 'asc'

    this.combosData = {}

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
    this.fieldsConfigForList = this.listService.getFieldsConfigForList()
    this.fieldsConfigForSearchForm =
      this.listService.getFieldsConfigForSearchForm()
    this.listService.setCombosData(this.combosData)
    this.search(false)
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.listService
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = {
              page: {
                size: result.data['size'],
                totalElements: result.data['total'],
                totalPages: result.page.totalPages,
                pageNumber: result.page.pageNumber,
                pageSize: result.page.pageSize,
              },
              data: result.data['items'],
            }
          }
        }),
    )
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getIdFieldName() {
    return 'name'
  }

  getId(row) {
    return row[this.getIdFieldName()]
  }

  reset() {
    this.searchForm.reset() //controls.status.reset();
    this.search()
  }

  search(isSearching = true) {
    if (this.searchForm && this.searchForm.get('search')) {
      this.searchForm.get('search').setValue(isSearching)
    }
    super.search()
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.elementsPage.page.pageNumber = dataTableEvent.offset
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.getList(
      this.searchFormData,
      this.order,
      this.orderType,
      dataTableEvent.offset + 1,
      this.elementsPage.page.pageSize,
    )
  }

  getExportColumns() {
    return this.listService.getExportColumns()
  }

  getExportHeader() {
    return this.listService.getExportHeader()
  }

  showExportButtons() {
    return false
  }

  onClickRow(row: any, propName = null) {
    this.listService
      .getDownloadedFile({
        file: row,
      })
      .subscribe((res) => {
        saveAs(res.file, res.fileName)
      })
  }

  canExecuteAction(action) {
    switch (action) {
      case 'file-upload':
        return this.authenticationService.activateOption('LGUpload', [], [])
        break
      default:
        break
    }
    return false
  }
}
