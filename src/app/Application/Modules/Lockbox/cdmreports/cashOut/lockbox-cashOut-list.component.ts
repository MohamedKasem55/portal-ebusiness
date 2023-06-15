import { FormBuilder, FormGroup } from '@angular/forms'
import { LockboxCashOutListService } from './lockbox-cashOut-list.service'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { SearchablePanelComponent } from 'arb-design'
import { Router } from '@angular/router'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'app-lockbox-cashOut-list',
  templateUrl: './lockbox-cashOut-list.component.html',
  styleUrls: ['./lockbox-cashOut-list.component.scss'],
})
export class LockboxCashOutListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  combosKeys: any[] = ['lockBoxTransactionStatus']
  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  terminalForm: FormGroup
  entityPropertiesTerminal: any[]

  routes: any[] = [
    ['lockBox.menu'],
    ['lockBox.cdmReports.menu', ['/lockbox/cdm-reports/list']],
    ['lockBox.cdmReports.cashOut'],
  ]

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: LockboxCashOutListService,
  ) {
    super(fb, translate, authenticationService, router)

    // this.order = "serialNumber";
    // this.orderType = "asc";

    this.combosData = {}

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.entityPropertiesTerminal = []
    this.searchForm = this.fb.group({})
    this.terminalForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()

    if (
      !this.listService.terminalSelected ||
      !this.listService.terminalSelected.terminalID
    ) {
      this.router.navigate([this.getBackUrl()])
      return
    }

    this.fieldsConfigForList = this.listService.getFieldsConfigForList()
    this.fieldsConfigForSearchForm =
      this.listService.getFieldsConfigForSearchForm()
    this.entityPropertiesTerminal =
      this.listService.getFieldEntityPropertiesTerminal()
    this.listService.setCombosData(this.combosData)
    // this.subscriptions.push(
    //     this.staticService.getAllCombosAsArrays(this.combosKeys)
    //         .subscribe((resultC) => {
    //             const data: any = resultC;
    //             // tslint:disable-next-line:prefer-for-of
    //             for (let i = 0; i < this.combosKeys.length; i++) {
    //                 this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]];
    //             }
    //             // -------------------------------------------------
    //
    //             this.fieldsConfigForList = this.listService.getFieldsConfigForList();
    //             this.fieldsConfigForSearchForm = this.listService.getFieldsConfigForSearchForm();
    //             this.entityPropertiesTerminal = this.listService.getFieldEntityPropertiesTerminal();
    //             this.listService.setCombosData(this.combosData);
    //             //this.search(false);
    //         })
    // );
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
    return 'batchId'
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
    return this.listService.showExportButtons()
  }

  onClickRow(row: any, propName = null) {
    // this.router.navigate(['/lockbox/cashOut/details'])
  }

  isInitiator() {
    return this.authenticationService.activateOption(
      'ManagementLockBox',
      [],
      ['ManagementLockBoxInitiator'],
    )
  }

  canExecuteAction(action) {
    switch (action) {
      default:
        break
    }
    return false
  }

  getBackUrl() {
    return '/lockbox/cdm-reports/list'
  }
}
