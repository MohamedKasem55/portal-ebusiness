import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import { RequestStatusService } from './request-status.service'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}
  tableDisplaySize = 20
  cities = []
  auxData = []
  futureLevels = false
  constructor(
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
    public staticService: StaticService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  ngOnInit(): void {
    super.ngOnInit()
    this.refreshData()
    this.requestStatus.batchList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  setPageSize(event) {
    this.tableDisplaySize = event.target.value
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.requestStatusService
      .getData(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.batchList = result.batchList.items
          this.requestStatus.page = pageInfo.offset
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.setElement(row)

    this.router.navigate([
      '/accounts/balanceCertificate/request-status/activate',
    ])
  }

  refreshData() {
    const combosSolicitados = ['cityType', 'batchSecurityLevelStatus']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        //console.log(data[combosSolicitados.indexOf("cityType")]);
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('cityType')]['values'],
        ).sort((a, b) => {
          return data[combosSolicitados.indexOf('cityType')]['values'][a] >
            data[combosSolicitados.indexOf('cityType')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('cityType')]['values'][b] >
              data[combosSolicitados.indexOf('cityType')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.cities[index[i]] =
            data[combosSolicitados.indexOf('cityType')]['values'][index[i]]
        }
        this.auxData['city'] = this.cities

        const status = []
        const statusLevel = Object.keys(
          data[combosSolicitados.indexOf('batchSecurityLevelStatus')]['values'],
        ).sort((a, b) => {
          return data[combosSolicitados.indexOf('batchSecurityLevelStatus')][
            'values'
          ][a] >
            data[combosSolicitados.indexOf('batchSecurityLevelStatus')][
              'values'
            ][b]
            ? 1
            : data[combosSolicitados.indexOf('batchSecurityLevelStatus')][
                'values'
              ][b] >
              data[combosSolicitados.indexOf('batchSecurityLevelStatus')][
                'values'
              ][a]
            ? -1
            : 0
        })
        for (let i = 0; i < statusLevel.length; i++) {
          status[statusLevel[i]] =
            data[combosSolicitados.indexOf('batchSecurityLevelStatus')][
              'values'
            ][statusLevel[i]]
        }
        this.auxData['status'] = status
      })
  }
  openModal(row, popup) {
    popup.openModal(row)
  }
}
