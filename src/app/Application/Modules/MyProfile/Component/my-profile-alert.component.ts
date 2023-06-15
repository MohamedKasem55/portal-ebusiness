// Imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceAlert } from '../Model/my-profile-alert-service.model'
import { AlertSelectedPipe } from '../Services/alert-selected-pipe'
import { MyProfileAlertService } from '../Services/my-profile-alert.service'

@Component({
  templateUrl: '../View/my-profile-alert.component.html',
})
// Component class implementing OnInit
export class MyProfileAlert
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('alertTable') table: any
  alertPage: PagedData<ModelServiceAlert>
  tableSelectedRows = []

  // Private properties for binding
  order: string
  orderType: string

  public isVisiblesError = false
  loading: boolean

  constructor(
    public service: MyProfileAlertService,
    public pipe: AlertSelectedPipe,
    public translate: TranslateService,
  ) {
    super()
    this.alertPage = new PagedData<ModelServiceAlert>()
    this.order = 'accountNumber'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  onSelect({ selected }) {
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.pipe.pushData(this.tableSelectedRows)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    // Service Call
    this.service
      .getAlertList(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.alertPage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.alertPage = result
        }
      })
  }

  setSort(dataTableEvent) {
    //console.log('Sort');
    if (dataTableEvent == null || !dataTableEvent.offest) {
      dataTableEvent.offset = 0
    }

    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.alertPage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.service
      .getAlertList(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.alertPage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.alertPage = result
          this.loading = false
        }
      })
  }

  onError(result) {
    //
    this.loading = false
  }
  // Load data ones componet is ready
  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  ngOnDestroy() {}

  getAlerts() {
    this.setPage({ offset: 0 })
  }

  getId(row) {
    return row['accountNumber']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
