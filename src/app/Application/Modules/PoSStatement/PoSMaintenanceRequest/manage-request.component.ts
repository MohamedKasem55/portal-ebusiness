import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

import { Exception } from '../../../Model/exception'

import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { ManageRequestService } from './manage-request.service'
import { RequestShareService } from './request-share.service'
import { StaticService } from '../../Common/Services/static.service'

@Component({
  selector: 'app-manage-request',
  templateUrl: './manage-request.component.html',
  styleUrls: ['./manage-request.component.scss'],
})
export class ManageRequestComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('pageTable', { static: true }) table: any

  urlAdd = ['/posstatement/pos-maintenance-request/add']
  urlModify = ['/posstatement/pos-maintenance-request/detail']
  urlRequestStatus = ['/posstatement/pos-maintenance-request/request-status']

  typeRequestFile = 'posMaintenanceRequestType'
  searchObject = {
    requestId: [''],
    type: [''],
    dateFrom: [''],
    dateTo: [''],
  }

  bsConfig: any
  types: any[]

  pageData: PagedData<any>

  private order: string
  private orderType: string

  tableSelectedRows: any = []

  isCollapsedContent = true

  data: any

  searchForm: FormGroup
  searchFormData: any

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public service: ManageRequestService,
    public requestShareService: RequestShareService,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)

    this.pageData = new PagedData<any>()
    this.pageData.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.pageData.page = page
    this.order = 'initiationDate'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
    )
    this.setPage(null)
    this.refreshCombos()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshCombos()
      }),
    )
  }

  refreshCombos() {
    const combosSolicitados = [this.typeRequestFile]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.types = []
        const type = this.typeRequestFile
        const index = Object.keys(
          data[combosSolicitados.indexOf(type)]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf(type)]['values'][a] >
            data[combosSolicitados.indexOf(type)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(type)]['values'][b] >
              data[combosSolicitados.indexOf(type)]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value: data[combosSolicitados.indexOf(type)]['values'][index[i]],
          })
        }
      })
  }

  goAdd() {
    this.router.navigate(this.urlAdd)
  }

  goRequestStatus() {
    this.router.navigate(this.urlRequestStatus)
  }

  details(data) {
    this.subscriptions.push(
      this.service.details(data).subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.requestShareService.setDataInit(result)
          this.router.navigate(this.urlModify)
        }
      }),
    )
    //this.requestShareService.setDataInit(data);
    //this.router.navigate(this.urlModify);
  }

  /*goDelete(){
        this.requestShareService.setSelectedData(this.tableSelectedRows);
        this.router.navigate(this.urlDelete);
    }*/

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.pageData.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .getRequest(
          this.searchFormData,
          this.pageData.page.pageNumber + 1,
          this.pageData.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.data = result
            this.pageData.page = result.page
            this.pageData.data = result.data
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.pageData.page.pageNumber = 0

    this.subscriptions.push(
      this.service
        .getRequest(
          this.searchFormData,
          this.pageData.page.pageNumber + 1,
          this.pageData.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.data = result
            this.pageData.page = result.page
            this.pageData.data = result.data
          }
        }),
    )
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    return this.tableSelectedRows
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .getRequest(
          this.searchFormData,
          1,
          this.pageData.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.data = result
            this.pageData.page = result.page
            this.pageData.data = result.data
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
  }
}
