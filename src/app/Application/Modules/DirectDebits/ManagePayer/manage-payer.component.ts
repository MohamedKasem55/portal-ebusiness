import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

import { Exception } from '../../../Model/exception'

import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { ManagePayerCompanyService } from './manage-payer-company.service'
import { ManagePayerService } from './manage-payer.service'
import { PayerShareService } from './payer-share.service'
import { StaticService } from '../../Common/Services/static.service'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  selector: 'app-manage-payer',
  templateUrl: './manage-payer.component.html',
  styleUrls: ['./manage-payer.component.scss'],
})
export class ManagePayerComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('listPageTable', { static: true }) table: any

  listPage: PagedData<any>

  tableSelectedRows: any = []

  isVisiblesError = false
  isCollapsedContent = true

  banks: any

  errorDescription

  myForm: FormGroup
  searchForm: FormGroup
  searchFormData: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['payrollBankCode']
  selectAllOnPage: any = []

  constructor(
    public fb: FormBuilder,
    private service: ManagePayerService,
    private serviceData: ManagePayerCompanyService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public payerShareService: PayerShareService,
    public authenticationService: AuthenticationService,
  ) {
    super()
    this.searchForm = this.fb.group({
      mandateNumber: [''],
      payerName: [''],
      bank: [''],
      payerAccount: [''],
      amountFrom: [''],
      amountTo: [''],
    })
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.listPage = new PagedData<any>()
    this.listPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.listPage.page = page
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )

    if (
      this.serviceData.tableSelectedRows &&
      this.serviceData.tableSelectedRows.length == 0
    ) {
      this.tableSelectedRows = []
    } else {
      this.tableSelectedRows = this.serviceData.tableSelectedRows
    }

    this.setPage(null)
  }

  refreshData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object = result
          this.banks = this.transformToKeyValue(
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values'],
          )
          //console.log(this.banks);
        }),
    )
  }

  transformToKeyValue(data) {
    const aux = []
    for (let i = 0; i < Object.keys(data).length; ++i) {
      aux.push({ key: Object.keys(data)[i], value: data[Object.keys(data)[i]] })
    }
    return aux
  }

  goAddPayer() {
    // this.payerShareService.setDataInit(result);
    this.router.navigate(['/direct-debits/manage-payer/addPayer'])
  }

  goModifyPayer() {
    this.payerShareService.setSelectedData(this.tableSelectedRows)
    this.router.navigate(['/direct-debits/manage-payer/modifyPayer'])
  }

  goDeletePayer() {
    this.payerShareService.setSelectedData(this.tableSelectedRows)
    this.router.navigate(['/direct-debits/manage-payer/deletePayer'])
  }

  setPage(dataTableEvent) {
    let search = true
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
      search = false
    }

    this.listPage.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .getList(
          this.searchFormData,
          this.listPage.page.pageNumber + 1,
          this.listPage.page.pageSize,
          search,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.listPage.page = result.page
            this.listPage.data = result.data
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    this.listPage.page.pageNumber = 1

    this.subscriptions.push(
      this.service
        .getList(
          this.searchFormData,
          this.listPage.page.pageNumber,
          this.listPage.page.pageSize,
          true,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.listPage.page = result.page
            this.listPage.data = result.data
          }
        }),
    )
  }

  // onSelect({selected}) {
  //     this.tableSelectedRows = [];
  //     this.tableSelectedRows.splice(0, selected.length);
  //     this.tableSelectedRows.push(...selected);
  //     //this.serviceData.setSelectedData(this.tableSelectedRows);
  //     return this.tableSelectedRows;
  // }
  onSelect({ selected }) {
    // Make sure we are no longer selecting all

    this.selectAllOnPage[this.listPage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.tableSelectedRows = this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.listPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.listPage.data.map((payer) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(payer),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.listPage.data)
      this.selectAllOnPage[this.listPage.page.pageNumber] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.listPage.data.map((payer) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(payer),
        )
      })
      this.selectAllOnPage[this.listPage.page.pageNumber] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
    this.serviceData.tableSelectedRows = this.tableSelectedRows
  }

  cleanSelected() {
    this.tableSelectedRows = []
    this.serviceData.tableSelectedRows = []
  }

  search() {
    this.cleanSelected()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .getList(this.searchFormData, 1, this.listPage.page.pageSize, true)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.listPage.page = result.page
            this.listPage.data = result.data
            this.serviceData.setData(result.data)
          }
        }),
    )
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  getId(row) {
    return row['companyCustomerPk']
  }
}
