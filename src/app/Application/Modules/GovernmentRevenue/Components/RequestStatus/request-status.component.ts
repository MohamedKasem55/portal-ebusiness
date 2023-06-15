import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe'
import { Page } from 'app/Application/Model/page'
import { StaticService } from 'app/Application/Modules/Common/Services/static.service'
import { SearchablePanelComponent } from 'arb-design'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { GovernmentRevenueService } from '../../Services/government-revenue.service'
import { RequestStatusService } from './request-status.service'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
})
export class RequestStatusComponent
  extends AbstractDatatableMobileComponent
  implements OnInit
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  combosKeys: any[] = ['beneficiaryBankCode','govRevenueBankCode']
  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  routes: any[] = [
    ['dashboard.payments'],
    ['dashboard.governmentRevenue', ['/government-revenue']],
    ['governmentRevenue.requestStatus'],
  ]

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: RequestStatusService,
    public revenueService: GovernmentRevenueService,
    private injector: Injector,
  ) {
    super(fb, translate, authenticationService, router)

    this.orderType = 'asc'

    this.combosData = {}

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()

    this.combosData['status'] = this.getStatusData()

    this.combosData['companyDepositors'] = []
    this.combosData['govRevenueAccountsList'] = []

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          // -------------------------------------------------
          this.listService.getInitValues().subscribe((result) => {
            if (result && result.errorCode != '0') {
            } else {
              // // -------------------------------------------------
              if (result && result.companyDepositors) {
                result.companyDepositors.forEach((item) => {
                  this.combosData['companyDepositors'].push({
                    key: item,
                    value: item.depositorOriginatorName,
                  })
                })
              }
              if (result && result.listInitiateAccountDTO) {
                result.listInitiateAccountDTO.forEach((item) => {
                  this.combosData['govRevenueAccountsList'].push({
                    key: item.fullAccountNumber,
                    value: item.fullAccountNumber + ' ' + item.alias,
                  })
                })
              }
              // -------------------------------------------------
              this.fieldsConfigForList =
                this.listService.getFieldsConfigForList()
              this.fieldsConfigForSearchForm =
                this.listService.getFieldsConfigForSearchForm()
              this.listService.setCombosData(this.combosData)
              this.search(false)
            }
          })
          // -------------------------------------------------
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
            const items = result.data['items'].sort((a, b) => {
              return a['initiationDate'] > b['initiationDate'] ? -1 : b['initiationDate'] > a['initiationDate'] ? 1 : 0
            })
            this.elementsPage = {
              page: {
                size: result.data['size'],
                totalElements: result.data['total'],
                totalPages: result.page.totalPages,
                pageNumber: result.page.pageNumber,
                pageSize: result.page.pageSize,
              },
              data: items,
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
    return 'serialNumber'
  }

  private getStatusData() {
    const status = [
      {
        key: 'P',
        value: new StatusPipe(this.injector).transform('P'),
      },
      {
        key: 'A',
        value: new StatusPipe(this.injector).transform('A'),
      },
      {
        key: 'R',
        value: new StatusPipe(this.injector).transform('R'),
      },
    ]

    return status
  }

  getId(row) {
    return row[this.getIdFieldName()]
  }

  reset() {
    this.searchForm.reset() //controls.status.reset();
    this.elementsPage.data = []
    this.elementsPage.page = new Page()
    this.search(false)
  }

  search(isSearching = true) {
    isSearching = this.searchForm.pristine ? false : true
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
    if ((propName = 'batchName' && row.batchName != null)) {
      this.revenueService.bulkUpload = row
      this.router.navigate([
        '/government-revenue/request-status/bulk-upload-details',
      ])
    } else {
      this.revenueService.previousPayment = row
      this.router.navigate(['/government-revenue/request-status/reactivate'])
    }
  }

  canExecuteAction(action) {
    switch (action) {
      case 'details':
        return this.authenticationService.activateOption(null, [], [])
      default:
        break
    }
    return false
  }

  onSearchFormAllFieldsCreated($event) {}
}
