import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from './request-status.service'
import { LevelFormatPipe } from '../../../Components/common/Pipes/getLevels-pipe'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table1', { static: true }) table1: any
  @ViewChild('table2', { static: true }) table2: any
  @ViewChild('table3', { static: true }) table3: any

  @Input() futureLevels = false

  urlManagementActivate = ['/posstatement/request-status/reactivate-management']
  urlMaintenanceActivate = [
    '/posstatement/request-status/reactivate-maintenance',
  ]
  urlRequestActivate = ['/posstatement/request-status/reactivate-request']
  urlClaimActivate = ['/posstatement/request-status/reactivate-claim']

  requestMaintenanceStatusSubscription: Subscription
  requestMaintenanceStatus: any = {}
  tableMaintenanceDisplaySize = 20

  requestManagementStatusSubscription: Subscription
  requestManagementStatus: any = {}
  tableManagementDisplaySize = 20

  requestRequestStatusSubscription: Subscription
  requestRequestStatus: any = {}
  tableRequestDisplaySize = 20

  requestClaimStatusSubscription: Subscription
  requestClaimStatus: any = {}
  tableClaimDisplaySize = 20

  searchObject = {
    dateFrom: [''],
    dateTo: [''],
    status: [''],
  }
  searchForm: FormGroup
  searchFormData: any
  bsConfig: any
  isCollapsedContent = true

  constructor(
    public fb: FormBuilder,
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
    public injector: Injector,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table1) {
      tablas.push(this.table1)
    }
    if (this.table2) {
      tablas.push(this.table2)
    }
    if (this.table3) {
      tablas.push(this.table3)
    }
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.requestMaintenanceStatus.elements = []
    this.requestMaintenanceStatus.size = 0
    this.requestMaintenanceStatus.total = 0

    this.requestManagementStatus.elements = []
    this.requestManagementStatus.size = 0
    this.requestManagementStatus.total = 0

    this.requestRequestStatus.elements = []
    this.requestRequestStatus.size = 0
    this.requestRequestStatus.total = 0

    this.requestClaimStatus.elements = []
    this.requestClaimStatus.size = 0
    this.requestClaimStatus.total = 0

    this.setManagementPage(null)
    this.setMaintenancePage(null)
    this.setRequestPage(null)
    //this.setClaimPage(null);
  }

  setManagementPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestManagementStatusSubscription = this.requestStatusService
      .getManagementData(
        this.searchFormData,
        pageInfo.offset + 1,
        this.tableManagementDisplaySize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.requestManagementStatus.elements =
            result.posManagementBatchList.items
          this.requestManagementStatus.size = result.posManagementBatchList.size
          this.requestManagementStatus.total =
            result.posManagementBatchList.total
          this.requestManagementStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }

        this.requestManagementStatusSubscription.unsubscribe()
      })
  }

  setMaintenancePage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestMaintenanceStatusSubscription = this.requestStatusService
      .getMaintenanceData(
        this.searchFormData,
        pageInfo.offset + 1,
        this.tableMaintenanceDisplaySize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.requestMaintenanceStatus.elements =
            result.posMaintenanceBatchList.items
          this.requestMaintenanceStatus.size =
            result.posMaintenanceBatchList.size
          this.requestMaintenanceStatus.total =
            result.posMaintenanceBatchList.total
          this.requestMaintenanceStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }

        this.requestMaintenanceStatusSubscription.unsubscribe()
      })
  }

  setRequestPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestRequestStatusSubscription = this.requestStatusService
      .getRequestData(
        this.searchFormData,
        pageInfo.offset + 1,
        this.tableRequestDisplaySize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.requestRequestStatus.elements = result.posRequestBatchList.items
          this.requestRequestStatus.size = result.posRequestBatchList.size
          this.requestRequestStatus.total = result.posRequestBatchList.total
          this.requestRequestStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }

        this.requestRequestStatusSubscription.unsubscribe()
      })
  }

  setClaimPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestClaimStatusSubscription = this.requestStatusService
      .getClaimData(
        this.searchFormData,
        pageInfo.offset + 1,
        this.tableClaimDisplaySize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.requestClaimStatus.elements = result.posClaimBatchList.items
          this.requestClaimStatus.size = result.posClaimBatchList.size
          this.requestClaimStatus.total = result.posClaimBatchList.total
          this.requestClaimStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }

        this.requestClaimStatusSubscription.unsubscribe()
      })
  }

  goManagementActivate(row) {
    this.requestStatusService.setElement(row)
    this.router.navigate(this.urlManagementActivate)
  }

  goMaintenanceActivate(row) {
    this.requestStatusService.setElement(row)
    this.router.navigate(this.urlMaintenanceActivate)
  }

  goRequestActivate(row) {
    this.requestStatusService.setElement(row)
    this.router.navigate(this.urlRequestActivate)
  }

  goClaimActivate(row) {
    this.requestStatusService.setElement(row)
    this.router.navigate(this.urlClaimActivate)
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.setManagementPage(null)
    this.setMaintenancePage(null)
    this.setRequestPage(null)
    //this.setClaimPage(null);
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
