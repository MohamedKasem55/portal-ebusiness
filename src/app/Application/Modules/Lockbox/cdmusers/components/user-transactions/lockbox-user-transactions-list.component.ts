import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SearchablePanelComponent } from 'arb-design'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { LockboxUserTransactionsListService } from './lockbox-user-transactions-list.service'

@Component({
  selector: 'app-lockbox-user-transactions-list',
  templateUrl: './lockbox-user-transactions-list.component.html',
  styleUrls: ['./lockbox-user-transactions-list.component.scss'],
})
export class LockboxUserTransactionsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  combosKeys: any[] = ['lockBoxTransactionStatus']

  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  entityPropertiesTerminal: any[]

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.userTransactions.menu'],
  ]

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: LockboxUserTransactionsListService,
  ) {
    super(fb, translate, authenticationService, router)

    // this.order = "serialNumber";
    // this.orderType = "asc";

    this.combosData = {}
    this.combosData['terminals'] = []
    this.combosData['lockBoxTransactionStatus'] = []

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.entityPropertiesTerminal = []
    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()
    this.loadComboData()
  }

  loadComboData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
            this.listService.combosData[this.combosKeys[i]] =
              data[this.combosKeys[i]]
          }
          // -------------------------------

          this.subscriptions.push(
            this.listService.getTerminals().subscribe((response) => {
              if (response.errorCode == '0') {
                let terminals = []
                const terminalsList = []
                if (response.errorCode == 0) {
                  terminals =
                    typeof response.terminalList != 'undefined'
                      ? response.terminalList
                      : []

                  terminals.forEach((terminal) => {
                    terminalsList.push({
                      key: terminal.terminalID,
                      value: terminal.terminalIDName,
                    })
                  })
                  this.combosData['terminals'] = terminalsList
                  this.listService.terminals = terminals
                }
              }
              // -------------------
              this.fieldsConfigForList =
                this.listService.getFieldsConfigForList()
              this.fieldsConfigForSearchForm =
                this.listService.getFieldsConfigForSearchForm()
              // --------------------
              if (this.searchForm.valid) {
                this.search(false)
              }
            }),
          )
        }),
    )
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
    this.elementsPage.data = []
  }

  search(isSearching = true) {
    if (this.searchForm && this.searchForm.get('search')) {
      this.searchForm.get('search').setValue(isSearching)
    }

    if (isSearching && this.searchForm.valid) {
      super.search()
    } else if (isSearching) {
      this.searchForm.markAllAsTouched()
    }
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
    // this.router.navigate(['/lockbox/user-transactions/details'])
  }

  getBackUrl() {
    return '/lockbox/cdm-users/list'
  }
}
